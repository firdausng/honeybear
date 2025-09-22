import {drizzle} from 'drizzle-orm/d1';
import * as schema from "$lib/server/db/schema";
import {users} from "$lib/server/db/schema";
import {eq, and} from "drizzle-orm";
import type {ValidateUserEmailCommand} from "$lib/server/auth/schema";

export class VerifyUserByEmailCommandHandler{
    constructor(private db:  D1Database) {
    }
    async handle(command: ValidateUserEmailCommand){
        console.log(`[VerifyUserByEmailCommandHandler] ${JSON.stringify(command, null, 2)}`);
        const client = drizzle(this.db, { schema });
        const user =  
            await client.select().from(users).where(
                and(
                    eq(users.email, command.email),
                    eq(users.active, true),
        )).limit(1);

        return user[0] || null;
    }
}