import type {RequestHandler} from "@sveltejs/kit";
import { redirect, error,  } from '@sveltejs/kit';
import {COOKIE_SESSION} from "$lib/server/constants";

export const GET: RequestHandler = async ({  platform, url, locals, cookies }) => {
    if(platform === undefined){
        throw new Error("No platform")
    }

    const code = url.searchParams.get("code");
    if(code === null){
        throw new Error("No Auth Code in url")
    }

    const authResponse = await locals.authService.authenticateWithCode(code);

    if(authResponse.sealedSession === undefined){
        throw new Error("No Session")
    }

    const user = await locals.verifyUserByEmail.handle({
        email: authResponse.user.email
    })
    console.log("[callback] verifyUserByEmail", user);
    if(!user){
        console.log("[callback] user not in the system, redirect to unauthorized");
        cookies.set('error_message', `User not found in system: ${authResponse.user.email}`, {
            path: '/',
        });
        
        redirect(307, '/unauthorized');
    }

    cookies.set(COOKIE_SESSION, authResponse.sealedSession, {
        path: "/",
    });

    redirect(307,"/");
};