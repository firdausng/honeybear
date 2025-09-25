import type {PageServerLoad} from "./$types";
import {COOKIE_SESSION} from "$lib/server/constants";
import { mockCustomers } from "$lib/server/mock/data";

export const load: PageServerLoad = async ({ locals, platform, url, cookies }) => {
    if(platform === undefined){
        throw new Error("No platform")
    }

    return {
        activeUser: locals.activeUser,
        customers: mockCustomers,
    };
}