import {drizzle} from 'drizzle-orm/d1';
import * as schema from "$lib/server/db/schema";
import {products} from "$lib/server/db/schema";

export type ProductId = {
    id: number
}

export type GetProductQuery = {
    productId: ProductId
}

export class GetProductHandler{
    constructor(private db:  D1Database) {
    }
    async handle(query: GetProductQuery){
        const client = drizzle(this.db, { schema });
        return await client.select().from(products).all();
    }
}