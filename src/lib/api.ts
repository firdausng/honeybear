import {Hono} from 'hono';
import productRouter from "$lib/server/products/router";
import {logger} from "hono/logger";
import {poweredBy} from 'hono/powered-by'
import userRouter from "$lib/server/users/router";
import {jwk} from "hono/jwk";
import {AuthService} from "$lib/server/auth-service.svelte";
import authRouter from "$lib/server/auth/router";

const router = new Hono<App.Api>()
    .use(async (c, next) => {
        const authService = new AuthService(c.env.WORKOS_API_KEY, c.env.WORKOS_CLIENT_ID, c.env.BASE_PATH, c.env.WORKOS_COOKIE_PASSWORD);
        const handler = jwk({
            jwks_uri: authService.getJwksUrl()
        });

        await handler(c, next);
    })
    .use(logger())
    .use(poweredBy({serverName: 'hono/cloudflare-workers'}))
    .route('/products', productRouter)
    .route('/users', userRouter)
    .route('/auth', authRouter)
    .onError((err, c) => {
        console.log('err', err);
        return c.json({
            status: 500,
            message: err.message,
        })
    })
;

export const api = new Hono<App.Api>().route('/api', router);

export type Router = typeof router;
 