import type { PageServerLoad } from "./$types";
import {makeClient} from "$lib/make-client";
import {mockOrders} from "$lib/server/mock/data";

export const load: PageServerLoad = async ({ locals, platform, fetch, cookies }) => {
    if(platform === undefined){
        throw new Error("platform not configured")
    }

    const client = makeClient(fetch);

    return {
        activeUser: locals.activeUser,
        orders: mockOrders,
    };
}
