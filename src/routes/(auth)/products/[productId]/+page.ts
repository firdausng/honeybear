import {superValidate } from "sveltekit-superforms";
import {valibot} from "sveltekit-superforms/adapters";
import type { PageLoad } from './$types';
import {productSchema} from "$lib/schema";

export type UserMessageSchema = typeof productSchema;

export const load: PageLoad = async ({ data }) => {
    const adapter = valibot(productSchema);
    if(!data.product){
        throw new Error("No product in load data");
    }

    const productForm = await superValidate({
        name: data.product.name,
        description: data.product.description,
        price: data.product.price,
        stock: data.product.stock,
        image: data.product.image,
        category: data.product.category,
        status: "active",
    }, adapter);
    return {
        activeUser: data.activeUser,
        product: data.product,
        productForm,
    }
}
