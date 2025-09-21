import {superValidate } from "sveltekit-superforms";
import {valibot} from "sveltekit-superforms/adapters";
import type { PageLoad } from './$types';
import {productSchema} from "$lib/schema";

export const load: PageLoad = async ({ data }) => {
    const adapter = valibot(productSchema);
    const productForm = await superValidate(adapter);
    return {
        activeUser: data.activeUser,
        products: data.products,
        productForm,
    }
}