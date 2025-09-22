import * as v from "valibot";

export const AddCategorySchema = v.object({
    name: v.string(),
    description: v.string(),
    status: v.string(),
    createdBy: v.string(),
})

export type AddCategoryCommand = v.InferInput<typeof AddCategorySchema>;