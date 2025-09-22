import * as v from "valibot";

export const ValidateUserEmailSchema = v.object({
    email: v.string(),
})

export type ValidateUserEmailCommand = v.InferInput<typeof ValidateUserEmailSchema>;