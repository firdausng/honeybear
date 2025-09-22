import { Hono } from 'hono'
import {vValidator} from "@hono/valibot-validator";
import {
    AddCategoryCommandHandler,
} from "$lib/server/categories/addCategory";
import {AddCategorySchema} from "$lib/server/categories/schema";
import {describeRoute, resolver} from "hono-openapi";

const categoryRouter = new Hono<App.Api>();

const CATEGORY_TAG = ['Categories'];
const commonCategoryConfig = {
    tags: CATEGORY_TAG,
};
categoryRouter.post(
    '/add-category',
    describeRoute({
        ...commonCategoryConfig,
        description: 'Add category',
        responses: {
            200: {
                description: 'Successful response',
                content: {
                    'application/json': { schema: resolver(AddCategorySchema) },
                },
            },
        },
    }),
    vValidator('json', AddCategorySchema), 
    async (c) => {
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

export default categoryRouter