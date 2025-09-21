import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { sql } from 'drizzle-orm';
import { relations } from 'drizzle-orm';

export const users = sqliteTable("users", {
    id: integer().primaryKey({ autoIncrement: true }),
    name: text().notNull(),
    email: text().notNull().unique(),
    password: text().notNull(),
    active: integer({ mode: 'boolean' }),
    role: text().notNull(),
    createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
    updatedAt: integer('updated_at', { mode: 'timestamp' }),
    deletedAt: integer('deleted_at', { mode: 'timestamp' }),
    createdBy: text('created_by',).notNull(),
    updatedBy: text('updated_by',),
    deletedBy: text('deleted_by',),
})
export const products = sqliteTable("products", {
    id: integer().primaryKey({ autoIncrement: true }),
    name: text().notNull(),
    description: text(),
    sku: text().notNull().unique(),
    status: text().notNull(),
    stock: integer({ mode: 'number' }).notNull(),
    isFeatured: integer({ mode: 'boolean' }).notNull(),
    price: text().notNull(),
    imagePath: text().notNull(), 
    createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
    updatedAt: integer('updated_at', { mode: 'timestamp' }),
    deletedAt: integer('deleted_at', { mode: 'timestamp' }),
    createdBy: text('created_by',).notNull(),
    updatedBy: text('updated_by',),
    deletedBy: text('deleted_by',),
});

// export const variants = sqliteTable("products", {
//     id: integer().primaryKey({ autoIncrement: true }),
//     name: text().notNull(),
//     sku: text().notNull().unique(),
//     status: text().notNull(),
//     stock: integer({ mode: 'number' }).notNull(),
//     price: text().notNull(),
//     imagePath: text().notNull(),
//    
//     createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
//     updatedAt: integer('updated_at', { mode: 'timestamp' }),
//     deletedAt: integer('deleted_at', { mode: 'timestamp' }),
//     createdBy: text('created_by',).notNull(),
//     updatedBy: text('updated_by',),
//     deletedBy: text('deleted_by',),
// });

// export const modifiers = sqliteTable("products", {
//     id: integer().primaryKey({ autoIncrement: true }),
//     name: text().notNull(),
//     description: text(),
//     sku: text().notNull().unique(),
//     status: text().notNull(),
//     stock: integer({ mode: 'number' }).notNull(),
//     isFeatured: integer({ mode: 'boolean' }).notNull(),
//     price: text().notNull(),
//     imagePath: text().notNull(),
//     createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
//     updatedAt: integer('updated_at', { mode: 'timestamp' }),
//     deletedAt: integer('deleted_at', { mode: 'timestamp' }),
//     createdBy: text('created_by',).notNull(),
//     updatedBy: text('updated_by',),
//     deletedBy: text('deleted_by',),
// });

export const categories = sqliteTable("categories", {
    id: integer().primaryKey({ autoIncrement: true }),
    name: text().notNull(),
    description: text(),
    status: text(),
    createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
    updatedAt: integer('updated_at', { mode: 'timestamp' }),
    deletedAt: integer('deleted_at', { mode: 'timestamp' }),
    createdBy: text('created_by',).notNull(),
    updatedBy: text('updated_by',),
    deletedBy: text('deleted_by',),
});

export const productCategories = sqliteTable("product_categories", {
    id: integer().primaryKey({ autoIncrement: true }),
    productId: integer('product_id').notNull(),
    categoryId: integer('category_id').notNull(),
    createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
    createdBy: text('created_by').notNull(),
});

export const productsRelations = relations(products, ({ many }) => ({
    productCategories: many(productCategories),
}));

export const categoriesRelations = relations(categories, ({ many }) => ({
    productCategories: many(productCategories),
}));

export const productCategoriesRelations = relations(productCategories, ({ one }) => ({
    product: one(products, {
        fields: [productCategories.productId],
        references: [products.id],
    }),
    category: one(categories, {
        fields: [productCategories.categoryId],
        references: [categories.id],
    }),
}));