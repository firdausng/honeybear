import { Hono } from 'hono'
import {vValidator} from "@hono/valibot-validator";
import {GetUserByEmailAndPasswordHandler} from "$lib/server/users/getUserByEmail";
import {object, string} from "valibot";
import type {VerifyUserByEmailCommand} from "$lib/server/auth/verifyUserByEmail";

const authRouter = new Hono<App.Api>();

const ValidateUserEmailSchema = object({
    email: string(),
})

authRouter.post('/validateUserEmail', vValidator('json', ValidateUserEmailSchema), async (c) => {
    const body = c.req.valid('json');
    const verifyUserByEmailCommand: VerifyUserByEmailCommand = {
        email: body.email,
    };
    
    const handler = new GetUserByEmailAndPasswordHandler(c.env.DB);
    const user = await handler.handle(verifyUserByEmailCommand);
    if (!user) {
        return c.json({
            status: 404,
            body: "Invalid email or password",
        })
    }
    
    return c.json(user, 200);
})

export default authRouter