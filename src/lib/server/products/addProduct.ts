import {drizzle} from 'drizzle-orm/d1';
import * as schema from "$lib/server/db/schema";
import {products} from "$lib/server/db/schema";
import type {AddProductCommand} from "$lib/server/products/schema";



export class AddProductHandler{
    constructor(private db:  D1Database) {
    }
    async handle(command: AddProductCommand){
        const client = drizzle(this.db, { schema });
        const date = new Date().toISOString();
        const product = await client.insert(products).values({
            name: command.name,
            description: command.description,
            sku: command.sku,
            stock: command.stock,
            price: command.price,
            imagePath: command.imagePath,
            status: command.status,
            isFeatured: command.isFeatured,
            createdAt: date,
            createdBy: command.createdBy,
        })
        return product;
    }
}