import {drizzle} from 'drizzle-orm/d1';
import * as schema from "$lib/server/db/schema";
import {categories} from "$lib/server/db/schema";
import type {AddCategoryCommand} from "$lib/server/categories/schema";

export class AddCategoryCommandHandler{
    constructor(private db:  D1Database) {
    }
    async handle(command: AddCategoryCommand){
        console.log(`[AddCategoryCommandHandler] ${JSON.stringify(command, null, 2)}`);
        const client = drizzle(this.db, { schema });
        const date = new Date().toISOString();
        const category = await client.insert(categories).values({
            name: command.name,
            description: command.description,
            status: command.status,
            createdAt: date,
            createdBy: command.createdBy,
        })
        return category;
    }
}