import { Hono } from 'hono'
import {vValidator} from "@hono/valibot-validator";
import {
    AddCategoryCommandHandler,
} from "$lib/server/categories/addCategory";
import {AddCategorySchema} from "$lib/server/categories/schema";

const authRouter = new Hono<App.Api>();

authRouter.post('/validateUserEmail', vValidator('json', AddCategorySchema), async (c) => {
    const body = c.req.valid('json');
    
    const handler = new AddCategoryCommandHandler(c.env.DB);
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