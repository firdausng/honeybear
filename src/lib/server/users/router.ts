import { Hono } from 'hono'
import {RegisterUserHandler} from "$lib/server/users/registerUser";
import {RegisterUserSchema, UserSchema} from "$lib/server/users/schema";
import {vValidator} from "@hono/valibot-validator";

const userRouter = new Hono<App.Api>();

userRouter.post(
    '/register',
    vValidator('json', RegisterUserSchema), 
    async (c) => {
    const body = c.req.valid('json');

    
    const handler = new RegisterUserHandler(c.env.DB);
    await handler.handle(body)
    
    return c.json(body, 201);
})

export default userRouter