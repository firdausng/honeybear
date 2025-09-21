import {drizzle} from 'drizzle-orm/d1';
import * as schema from "$lib/server/db/schema";
import {users} from "$lib/server/db/schema";
import {eq, and} from "drizzle-orm";

export type GetUserByEmailQuery = {
    email: string
}

export class GetUserByEmailAndPasswordHandler{
    constructor(private db:  D1Database) {
    }
    async handle(query: GetUserByEmailQuery){
        const client = drizzle(this.db, { schema });
        return client.select().from(users).where(and(
            eq(users.email, query.email),
            eq(users.active, true),
        ));
    }
}