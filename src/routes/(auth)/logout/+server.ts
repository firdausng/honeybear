import type {RequestHandler} from "@sveltejs/kit";
import { redirect } from '@sveltejs/kit';
import {COOKIE_SESSION} from "$lib/server/constants";

export const GET: RequestHandler = async ({ request, platform, url, locals, cookies }) => {
    const session = cookies.get(COOKIE_SESSION);
    console.log(session)
    if(!session){
        redirect(307, "/");
    }
    const logoutUrl = await locals.authService.getLogoutRedirectUrl(session!);

    cookies.delete(COOKIE_SESSION, { path: "/"});
    console.log('logoutUrl', logoutUrl);
    redirect(307, logoutUrl);
};

type WorkOSToken = {
    sid: string
}