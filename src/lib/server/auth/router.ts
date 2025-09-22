import { Hono } from 'hono'
import {vValidator} from "@hono/valibot-validator";
import {GetUserByEmailAndPasswordHandler} from "$lib/server/users/getUserByEmail";
import {ValidateUserEmailSchema} from "$lib/server/auth/schema";

const authRouter = new Hono<App.Api>();

authRouter.post(
    '/validateUserEmail', 
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