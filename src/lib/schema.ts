import { object, string, email, optional, pipe, minLength, uuid, number, decimal, boolean } from 'valibot';

export const productSchema = object({
    name: pipe(string(), minLength(2)),
    sku: pipe(string(), minLength(2)),
    description: pipe(string(), minLength(2)),
    image: pipe(string(), minLength(2)),
    price: pipe(string(), decimal()),
    category: pipe(string(), minLength(2)),
    stock: pipe(number()),
    status: pipe(string(), minLength(2)),
    featured: pipe(boolean()),
});
export type ProductSchema = typeof productSchema;

export const User = object({
    id: pipe(string(), uuid()),
    name: pipe(string(), minLength(1)),
    email: pipe(string(), minLength(1)),
    password: pipe(string(), minLength(1)),
});