import {drizzle} from 'drizzle-orm/d1';
import * as schema from "$lib/server/db/schema";
import {users} from "$lib/server/db/schema";
import {eq, and} from "drizzle-orm";

export type GetUserByEmailAndPasswordQuery = {
    email: string
    password: string
}

export class GetUserByEmailAndPasswordHandler{
    constructor(private db:  D1Database) {
    }
    async handle(query: GetUserByEmailAndPasswordQuery){
        const client = drizzle(this.db, { schema });
        return client.select().from(users).where(and(
            eq(users.email, query.email),
            eq(users.password, query.password),
            eq(users.active, true),
        ));
    }
}