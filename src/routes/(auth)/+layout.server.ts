import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({locals, url}) => {
    return {
        activeUser: locals.activeUser,
        url: url.pathname,
    };
}