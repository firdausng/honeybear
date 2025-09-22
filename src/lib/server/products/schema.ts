import * as v from "valibot";

export const AddProductCommandSchema = v.object({
    name: v.pipe(v.string(),),
    description: v.pipe(v.string(),),
    sku: v.pipe(v.string(),),
    price: v.pipe(v.string(), v.decimal()),
    stock: v.pipe(v.number(),),
    imagePath: v.pipe(v.string(),),
    status: v.pipe(v.string(),),
    isFeatured: v.pipe(v.boolean(),),
    createdBy: v.pipe(v.string(),),
});

export type AddProductCommand = v.InferInput<typeof AddProductCommandSchema>;

export const ProductResponseSchema = v.object({
    id: v.number(),
    name: v.string(),
    price: v.string(),
    description: v.string(),
    sku: v.string(),
    stock: v.number(),
    imagePath: v.string(),
    status: v.string(),
    isFeatured: v.boolean(),
    createdBy: v.string(),
});

export const ProductArraySchema = v.array(ProductResponseSchema);