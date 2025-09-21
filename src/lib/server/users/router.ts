import { Hono } from 'hono'
import {zValidator} from "@hono/zod-validator";
import {z} from "zod/v4";
import {type RegisterUserCommand, RegisterUserHandler} from "$lib/server/users/registerUser";
import {type GetUserByEmailQuery, GetUserByEmailAndPasswordHandler} from "$lib/server/users/getUserByEmail";

export const User = z.object({
    id: z.uuidv7(),
    name: z.string().min(1),
    email: z.string().min(1),
    password: z.string().min(1),
});

type User = z.infer<typeof User>;
export const RegisterUserInput = User.pick({ 
    name: true,
    email: true,
    password: true,
});

const userRouter = new Hono<App.Api>();

userRouter.get('/', (c) => c.json('list books'))
userRouter.get('/:id', (c) => c.json(`get ${c.req.param('id')}`))

// userRouter.get('/:id', (c) => {
//     const email = c.req.query('email')
//     const query: GetUserByEmailQuery = {
//         email: ""
//     }
// });

userRouter.post('/register', zValidator('json', RegisterUserInput), async (c) => {
    const body = c.req.valid('json');
    const user: RegisterUserCommand = {
        name: body.name,
        email: body.email,
        password: body.password,
        active: true,
    };
    
    const handler = new RegisterUserHandler(c.env.DB);
    await handler.handle(user)
    
    return c.json(user, 201);
})

export default userRouter