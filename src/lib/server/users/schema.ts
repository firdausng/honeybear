import * as v from "valibot";

export const UserSchema = v.object({
    name: v.string(),
    email: v.string(),
    password: v.string(),
    role: v.string(),
    active: v.boolean(),
})

export type User = v.InferInput<typeof UserSchema>;
export const RegisterUserSchema = v.pick(UserSchema, [
    "name",
    "email",
    "password",
]);

export type RegisterUserCommand = v.InferInput<typeof RegisterUserSchema>;

