import { Hono } from 'hono'
import {vValidator} from "@hono/valibot-validator";
import {GetUserByEmailAndPasswordHandler} from "$lib/server/users/getUserByEmail";
import {ValidateUserEmailSchema} from "$lib/server/auth/schema";
import {describeRoute, resolver, } from "hono-openapi";

const authRouter = new Hono<App.Api>();

const AUTH_TAG = ['Auth'];
const commonAuthConfig = {
    tags: AUTH_TAG,
};

authRouter.post(
    '/validate-user-email',
    describeRoute({
        ...commonAuthConfig,
        description: 'Validate user email and password',
        responses: {
            200: {
                description: 'Successful response',
                content: {
                    'application/json': { schema: resolver(ValidateUserEmailSchema) },
                },
            },
        },
    }),
    vValidator('json', ValidateUserEmailSchema), 
    async (c) => {
    const body = c.req.valid('json');
    
    const handler = new GetUserByEmailAndPasswordHandler(c.env.DB);
    const user = await handler.handle(body);
    if (!user) {
        return c.json({
            status: 404,
            body: "Invalid email or password",
        })
    }
    
    return c.json(user, 200);
})

export default authRouter