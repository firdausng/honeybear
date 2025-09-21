import {type Handle} from "@sveltejs/kit";
import {GetCatalogHandler} from "$lib/server/products/getCatalog";
import {GetProductHandler} from "$lib/server/products/getProduct";
import {AuthService} from "$lib/server/auth-service.svelte";
import {COOKIE_SESSION} from "$lib/server/constants";
import {VerifyUserByEmailCommandHandler} from "$lib/server/auth/verifyUserByEmail";
import { redirect, error } from '@sveltejs/kit';
import {AddProductHandler} from "$lib/server/products/addProduct";
import type { User } from "@workos-inc/node";

export const setupServicesHandler: Handle = async ({ event, resolve }) => {
    if(event.platform === undefined){
        throw new Error("No Platform")
    }
    
    const db = event.platform.env.DB;
    if(db === undefined){
        throw new Error("Database not defined");
    }
    event.locals.getCatalog = new GetCatalogHandler(db);
    event.locals.getProduct = new GetProductHandler(db);
    event.locals.verifyUserByEmail = new VerifyUserByEmailCommandHandler(db);
    event.locals.addProductHandler = new AddProductHandler(db);
    event.locals.authService = new AuthService(event.platform.env.WORKOS_API_KEY, event.platform.env.WORKOS_CLIENT_ID, event.platform.env.BASE_PATH, event.platform.env.WORKOS_COOKIE_PASSWORD);
    
    return resolve(event);
};

const publicRoutes = [
    '/login',
    '/logged-out',
    '/callback',
    '/unauthorized',
    '/.well-known',
    '/api'
]

export const checkSessionHandler: Handle = async ({ event, resolve }) => {
    const pathname = event.url.pathname;
    if (publicRoutes.some(route => pathname.startsWith(route))) {
        return resolve(event);
    }
    
    const sessionData = event.cookies.get(COOKIE_SESSION);
    if(!sessionData){
        console.warn("[checkSessionHandler] cannot found auth cookie, redirect to login");
        return redirect(307, "/login");
    }

    let session = await event.locals.authService.authenticate(sessionData);
    
    let user : User | null = null;
    if(!session.authenticated){
        console.warn("[checkSessionHandler] user not authenticated", session);

        const sessionCookie = await event.locals.authService.getSessionFromCookie(sessionData);
        if(sessionCookie){
            const refreshedSession = await event.locals.authService.authenticateWithRefreshToken(sessionCookie.refreshToken);
            user = refreshedSession.user;

            console.log("[checkSessionHandler] session refreshed", refreshedSession);
            if(!refreshedSession.sealedSession){
                console.warn("[checkSessionHandler] cannot obtain sealedSession, redirect to login");
                return redirect(307, "/login");
            }

            event.cookies.set(COOKIE_SESSION, refreshedSession.sealedSession, {
                path: '/',
            })
        }else{
            console.warn("[checkSessionHandler] no session cookie, redirect to login");
            return redirect(307, "/login");
        }  
    }else{
        user = session.user;
    }

    console.log("[checkSessionHandler] setting active user to the local data");
    event.locals.activeUser = user;

    return resolve(event);
};