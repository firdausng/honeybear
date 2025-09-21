import {drizzle} from 'drizzle-orm/d1';
import * as schema from "$lib/server/db/schema";
import {users} from "$lib/server/db/schema";

export type RegisterUserCommand = {
    name: string
    email: string
    password: string
    active: boolean
}

export class RegisterUserHandler{
    constructor(private db:  D1Database) {
    }
    async handle(command: RegisterUserCommand){
        const client = drizzle(this.db, { schema });
        const date = new Date().toISOString();
        const res = await client.insert(users).values({
            name: command.name,
            email: command.email,
            password: command.password,
            role: "user",
            active: command.active,
            createdAt: date,
            createdBy: "system",
        })
    }
}