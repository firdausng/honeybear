import type {PageServerLoad} from "./$types";
import {COOKIE_SESSION} from "$lib/server/constants";
import {mockProducts} from "$lib/server/mock/data";
import type {Actions} from "../../../../../.svelte-kit/types/src/routes/(auth)/products/$types";
import {message, superValidate} from "sveltekit-superforms";
import {valibot} from "sveltekit-superforms/adapters";
import {productSchema} from "$lib/schema";
import {fail} from "@sveltejs/kit";

export const load: PageServerLoad = async ({ locals, platform, params}) => {
    if(platform === undefined){
        throw new Error("No platform")
    }
    
    const product = mockProducts.find(p => p.id === params.productId);
    if(!product){
        return {
            status: 404,
            error: new Error("Product not found")
        }
    }

    return {
        activeUser: locals.activeUser,
        product,
    };
}


export const actions: Actions = {
    default: async ({ request, platform }) => {
        const formData = await request.formData();

        const form = await superValidate(formData, valibot(productSchema));
        
        if (!form.valid) {
            return fail(400, { form });
        }
        return message(form, `product update successfully`);
    },
};