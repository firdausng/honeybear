import type {PageServerLoad, Actions} from "./$types";
import {mockProducts} from "$lib/server/mock/data";
import {fail, redirect} from "@sveltejs/kit";
import {message, superValidate} from "sveltekit-superforms";
import {valibot} from "sveltekit-superforms/adapters";
import {productSchema} from "$lib/schema";
import {makeClient} from "$lib/make-client";
import {COOKIE_SESSION} from "$lib/server/constants";

export const load: PageServerLoad = async ({ locals, platform, url, cookies }) => {
    if(platform === undefined){
        throw new Error("No platform")
    }
    
    return {
        activeUser: locals.activeUser,
        products: mockProducts,
    };
}

export const actions: Actions = {
    default: async ({ request, cookies, fetch, locals }) => {
        const formData = await request.formData();

        const form = await superValidate(formData, valibot(productSchema));

        console.log("request", formData, form);

        if (!form.valid) {
            return fail(400, { form });
        }

        const sessionData = cookies.get(COOKIE_SESSION);
        if(!sessionData){
            console.log("[checkSessionHandler] cannot found auth cookie, redirect to login");
            return redirect(307, "/login");
        }

        const session = await locals.authService.authenticate(sessionData);
        if(!session.authenticated){
            console.log("[checkSessionHandler] invalid cookie, redirect to login", session);
            return redirect(307, "/login");
        }

        try {
            // Prepare the product data for the API
            const productData = {
                name: form.data.name,
                description: form.data.description,
                sku: `SKU-${Date.now()}`, // Generate SKU if not provided
                price: form.data.price,
                stock: form.data.stock,
                imagePath: form.data.image,
                status: form.data.status,
                isFeatured: false, // Default value
                createdBy: locals.activeUser?.id || 'system'
            };

            const response = await fetch("/api/products", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${session.accessToken}`,
                },
                body: JSON.stringify(productData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error("API Error:", errorData);
                return fail(response.status, { 
                    form,
                    error: (errorData as Error).message || "Failed to create product"
                });
            }

            const result = await response.json();
            console.log("Product created:", result);
            
            return message(form, `Product "${form.data.name}" created successfully`);
        } catch (error) {
            console.error("Error creating product:", error);
            return fail(500, { 
                form,
                error: "Internal server error while creating product"
            });
        }
    },
};