import { Hono } from 'hono'
import {vValidator} from "@hono/valibot-validator";
import {object, string, number, decimal, pipe, boolean} from "valibot";
import {basicAuth} from "hono/basic-auth";
import {GetUserByEmailAndPasswordHandler} from "$lib/server/users/getUserByEmailAndPassword";
import {type AddProductCommand, AddProductHandler} from "$lib/server/products/addProduct";

export const AddProductCommandSchema = object({
    name: pipe(string(),),
    description: pipe(string(),),
    sku: pipe(string(),),
    price: pipe(string(), decimal()),
    stock: pipe(number(),),
    imagePath: pipe(string(),),
    status: pipe(string(),),
    isFeatured: pipe(boolean(),),
    createdBy: pipe(string(),),
});


const productRouter = new Hono<App.Api>();

// productRouter.use(async (c, next) => {
//     const auth = getAuth(c);
//     if (!auth?.userId) {
//         return c.json({
//             message: 'You are not logged in.',
//         })
//     }
//     await next()
// });
// productRouter.use(basicAuth({
//     verifyUser: async (username, password, c) => {
//         const getUser = new GetUserByEmailAndPasswordHandler(c.env.DB);
//         const user = await getUser.handle({email: username, password: password});
//         console.log('user: ', user);
//         return user.length > 0;
//     },
// }))


productRouter.get('/', (c) => c.json('list books'))
productRouter.get('/:id', (c) => c.json(`get ${c.req.param('id')}`))

productRouter.post('/', vValidator('json', AddProductCommandSchema), async (c) => {
    const body = c.req.valid('json');
    const addProductCommand: AddProductCommand = {
        name: body.name,
        price: body.price,
        description: body.description,
        sku: body.sku,
        stock: body.stock,
        imagePath: body.imagePath,
        status: body.status,
        isFeatured: body.isFeatured,
        createdBy: body.createdBy,
    };

    const handler = new AddProductHandler(c.env.DB);
    const product = await handler.handle(addProductCommand);
    console.log('[ProductRouter:Post]',product);
    return c.json(product.results, 201);
})

export default productRouter