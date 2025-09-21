import {drizzle} from 'drizzle-orm/d1';
import * as schema from "$lib/server/db/schema";
import {products} from "$lib/server/db/schema";

export type GetCatalogQuery = {
    size: number
    page: number
    sort: string
    order: string
    search: string
}

export class GetCatalogHandler{
    constructor(private db:  D1Database) {
    }
    async handle(query: GetCatalogQuery){
        const client = drizzle(this.db, { schema });
        return await client.select().from(products).all();
    }
}