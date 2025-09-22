import { Hono } from 'hono'
import {RegisterUserHandler} from "$lib/server/users/registerUser";
import {RegisterUserSchema} from "$lib/server/users/schema";
import {vValidator} from "@hono/valibot-validator";
import {describeRoute, resolver} from "hono-openapi";

const userRouter = new Hono<App.Api>();

const USER_TAG = ['Users'];
const commonUserConfig = {
    tags: USER_TAG,
};

userRouter.post(
    '/register',
    describeRoute({
        ...commonUserConfig,
        description: 'Register a new user',
        responses: {
            200: {
                description: 'Successful response',
                content: {
                    'application/json': { schema: resolver(RegisterUserSchema) },
                },
            },
        },
    }),
    vValidator('json', RegisterUserSchema), 
    async (c) => {
    const body = c.req.valid('json');

    
    const handler = new RegisterUserHandler(c.env.DB);
    await handler.handle(body)
    
    return c.json(body, 201);
})

export default userRouter