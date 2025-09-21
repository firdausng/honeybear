import {GetCatalogHandler} from "$lib/server/products/getCatalog";
import {GetProductHandler} from "$lib/server/products/getProduct";
import {AddProductHandler} from "$lib/server/products/addProduct";
import {GetUserHandler} from "$lib/server/users/addUser";
import {VerifyUserByEmailCommandHandler} from "$lib/server/auth/verifyUserByEmail";
import type {RequestIdVariables} from "hono/request-id";
import type {AuthService} from "$lib/server/auth-service.svelte";
import type {User} from "@workos-inc/node";

declare global {
	namespace App {
        interface Platform {
            env: Cloudflare.Env
            cf: CfProperties
            ctx: ExecutionContext
        }

        interface Locals {
            getCatalog: GetCatalogHandler,
            getProduct: GetProductHandler,
            verifyUserByEmail:VerifyUserByEmailCommandHandler,
            addProductHandler: AddProductHandler,
            addUser: GetUserHandler,
            authService: AuthService,
            error: Error
            activeUser: User
        }
        
        interface Error {
            message: string,
            code: number,
        }

        interface Api {
            Bindings: Cloudflare.Env,
            Variables: RequestIdVariables
        }
    }
    
    namespace Client {
        interface MenuItem {
            id: string
            label: string
            icon: Component<IconComponentProps, {}, "">
            path: string
        }

        export interface Product {
            id: string;
            name: string;
            description: string;
            sku: string;
            status: 'active' | 'inactive' | 'out_of_stock';
            stock: number;
            isFeatured: boolean;
            price: string;
            imagePath: string;
            category: string;
        }

        export interface Category {
            id: string;
            name: string;
            description: string;
        }

        export interface Order {
            id: string;
            customerName: string;
            customerEmail: string;
            total: number;
            status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
            items: OrderItem[];
            createdAt: string;
            shippingAddress: {
                street: string;
                city: string;
                state: string;
                zip: string;
                country: string;
            };
        }

        export interface OrderItem {
            productId: string;
            productName: string;
            quantity: number;
            price: number;
            total: number;
        }
    }
}

export {};