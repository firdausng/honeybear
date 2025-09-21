import { Hono } from 'hono'
import {vValidator} from "@hono/valibot-validator";
import {object, string, number, decimal, pipe, boolean} from "valibot";
import {basicAuth} from "hono/basic-auth";
import {GetUserByEmailAndPasswordHandler} from "$lib/server/users/getUserByEmailAndPassword";
import {type AddProductCommand, AddProductHandler} from "$lib/server/products/addProduct";
import {drizzle} from "drizzle-orm/d1";
import * as schema from "$lib/server/db/schema";
import {categories, products} from "$lib/server/db/schema";
import {and, eq} from "drizzle-orm";
import categoryRouter from "$lib/server/categories/router";

export const AddProductCommandSchema = object({
    name: pipe(string(),),
    description: pipe(string(),),
    sku: pipe(string(),),
    price: pipe(string(), decimal()),
    stock: pipe(number(),),
    imagePath: pipe(string(),),
    status: pipe(string(),),
    isFeatured: pipe(boolean(),),
    createdBy: pipe(string(),),
});


const productRouter = new Hono<App.Api>();

productRouter.get('/', async (c) => {
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
productRouter.get('/:id', async (c) =>{
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

productRouter.post('/', vValidator('json', AddProductCommandSchema), async (c) => {
    const body = c.req.valid('json');
    const addProductCommand: AddProductCommand = {
        name: body.name,
        price: body.price,
        description: body.description,
        sku: body.sku,
        stock: body.stock,
        imagePath: body.imagePath,
        status: body.status,
        isFeatured: body.isFeatured,
        createdBy: body.createdBy,
    };

    const handler = new AddProductHandler(c.env.DB);
    const product = await handler.handle(addProductCommand);
    console.log('[ProductRouter:Post]',product);
    return c.json(product.results, 201);
})

export default productRouter