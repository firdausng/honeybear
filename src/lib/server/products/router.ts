import { Hono } from 'hono'
import {vValidator} from "@hono/valibot-validator";
import {AddProductHandler} from "$lib/server/products/addProduct";
import {drizzle} from "drizzle-orm/d1";
import * as schema from "$lib/server/db/schema";
import {products} from "$lib/server/db/schema";
import {and, eq} from "drizzle-orm";
import { describeRoute, resolver } from 'hono-openapi'
import {AddProductCommandSchema, ProductArraySchema, ProductResponseSchema} from "$lib/server/products/schema";

const productRouter = new Hono<App.Api>();

const PRODUCT_TAG = ['Products'];
const commonProductConfig = {
    tags: PRODUCT_TAG,
};


productRouter.get(
    '/',
    describeRoute({
        ...commonProductConfig,
        description: 'Get products list',
        responses: {
            200: {
                description: 'Successful response',
                content: {
                    'application/json': { schema: resolver(ProductResponseSchema) },
                },
            },
        },
    }),
    async (c) => {
    const client = drizzle(c.env.DB, { schema });

    const list =
        await client.select().from(products).where(
            and(
                eq(products.status, "active"),
            ));

    return c.json({
        data: list.map(x => ({
            id: x.id,
            name: x.name,
            price: x.price,
            description: x.description,
            sku: x.sku,
            stock: x.stock,
            imagePath: x.imagePath,
            status: x.status,
            isFeatured: x.isFeatured,
            createdBy: x.createdBy,
        }))
    });
})
productRouter.get(
    '/:id',
    describeRoute({
        ...commonProductConfig,
        description: 'Get products details by id',
        responses: {
            200: {
                description: 'Successful response',
                content: {
                    'application/json': { schema: resolver(ProductArraySchema) },
                },
            },
        },
    }),
    async (c) =>{
    const id = c.req.param('id');
    const client = drizzle(c.env.DB, { schema });
    const data =
        await client.select().from(products).where(
            and(
                eq(products.id, Number(id)),
                eq(products.status, "active"),
            ))
            .limit(1);
    
    console.log("[ProductRouter:/:id]", data)

    if(data.length === 0){
        return c.json({
            status: 404,
            message: "Category not found",
        }, 404)
    }

    return c.json(data[0]);
})

productRouter.post('/',
    describeRoute({
        ...commonProductConfig,
        description: 'Create a new product',
        responses: {
            201: {
                description: 'Successful response',
                content: {
                    'application/json': { schema: resolver(ProductResponseSchema) },
                },
            },
        },
    }),
    vValidator('json', AddProductCommandSchema), 
    async (c) => {
    const body = c.req.valid('json');

    const handler = new AddProductHandler(c.env.DB);
    const product = await handler.handle(body);
    console.log('[ProductRouter:Post]',product);
    return c.json(product.results, 201);
})

export default productRouter