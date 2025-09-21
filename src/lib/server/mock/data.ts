export const mockProducts: Client.Product[] = [
    {
        id: '1',
        name: 'Wireless Bluetooth Headphones',
        sku: 'PRD-1',
        description: 'Premium wireless headphones with noise cancellation and 30-hour battery life',
        price: "199.99",
        category: 'Electronics',
        stock: 45,
        imagePath: 'https://images.pexels.com/photos/3945683/pexels-photo-3945683.jpeg?auto=compress&cs=tinysrgb&w=300',
        status: 'active',
        isFeatured: true,
        createdAt: '2024-01-15T10:00:00Z',
        updatedAt: '2024-01-20T14:30:00Z'
    },
    {
        id: '2',
        name: 'Smart Fitness Watch',
        sku: 'PRD-2',
        description: 'Advanced fitness tracker with heart rate monitoring and GPS',
        price: "299.99",
        category: 'Electronics',
        stock: 23,
        imagePath: 'https://images.pexels.com/photos/437037/pexels-photo-437037.jpeg?auto=compress&cs=tinysrgb&w=300',
        status: 'active',
        isFeatured: false,
        createdAt: '2024-01-10T09:15:00Z',
        updatedAt: '2024-01-18T11:45:00Z'
    },
    {
        id: '3',
        name: 'Organic Cotton T-Shirt',
        sku: 'PRD-3',
        description: 'Comfortable and sustainable organic cotton t-shirt in various colors',
        price: "29.99",
        category: 'Clothing',
        stock: 0,
        imagePath: 'https://images.pexels.com/photos/996329/pexels-photo-996329.jpeg?auto=compress&cs=tinysrgb&w=300',
        status: 'out_of_stock',
        isFeatured: true,
        createdAt: '2024-01-12T16:20:00Z',
        updatedAt: '2024-01-22T09:10:00Z'
    },
    {
        id: '4',
        name: 'Professional Camera Lens',
        sku: 'PRD-4',
        description: '50mm f/1.4 prime lens for professional photography',
        price: "899.99",
        category: 'Photography',
        stock: 8,
        imagePath: 'https://images.pexels.com/photos/90946/pexels-photo-90946.jpeg?auto=compress&cs=tinysrgb&w=300',
        status: 'active',
        isFeatured: false,
        createdAt: '2024-01-08T13:30:00Z',
        updatedAt: '2024-01-25T15:20:00Z'
    },
    {
        id: '5',
        name: 'Ergonomic Office Chair',
        sku: 'PRD-5',
        description: 'High-quality ergonomic office chair with lumbar support',
        price: "449.99",
        category: 'Furniture',
        stock: 12,
        imagePath: 'https://images.pexels.com/photos/586753/pexels-photo-586753.jpeg?auto=compress&cs=tinysrgb&w=300',
        status: 'active',
        isFeatured: false,
        createdAt: '2024-01-05T11:00:00Z',
        updatedAt: '2024-01-20T16:45:00Z'
    }
];

export const mockOrders: Client.Order[] = [
    {
        id: 'ORD-001',
        customerName: 'John Smith',
        customerEmail: 'john.smith@email.com',
        total: 229.98,
        status: 'processing',
        items: [
            {
                productId: '1',
                productName: 'Wireless Bluetooth Headphones',
                quantity: 1,
                price: 199.99,
                total: 199.99
            },
            {
                productId: '3',
                productName: 'Organic Cotton T-Shirt',
                quantity: 1,
                price: 29.99,
                total: 29.99
            }
        ],
        createdAt: '2024-01-25T14:30:00Z',
        shippingAddress: {
            street: '123 Main St',
            city: 'New York',
            state: 'NY',
            zip: '10001',
            country: 'USA'
        }
    },
    {
        id: 'ORD-002',
        customerName: 'Sarah Johnson',
        customerEmail: 'sarah.j@email.com',
        total: 299.99,
        status: 'shipped',
        items: [
            {
                productId: '2',
                productName: 'Smart Fitness Watch',
                quantity: 1,
                price: 299.99,
                total: 299.99
            }
        ],
        createdAt: '2024-01-24T09:15:00Z',
        shippingAddress: {
            street: '456 Oak Ave',
            city: 'Los Angeles',
            state: 'CA',
            zip: '90210',
            country: 'USA'
        }
    },
    {
        id: 'ORD-003',
        customerName: 'Michael Brown',
        customerEmail: 'mike.brown@email.com',
        total: 899.99,
        status: 'delivered',
        items: [
            {
                productId: '4',
                productName: 'Professional Camera Lens',
                quantity: 1,
                price: 899.99,
                total: 899.99
            }
        ],
        createdAt: '2024-01-20T11:45:00Z',
        shippingAddress: {
            street: '789 Pine St',
            city: 'Chicago',
            state: 'IL',
            zip: '60601',
            country: 'USA'
        }
    },
    {
        id: 'ORD-004',
        customerName: 'Emily Davis',
        customerEmail: 'emily.davis@email.com',
        total: 449.99,
        status: 'pending',
        items: [
            {
                productId: '5',
                productName: 'Ergonomic Office Chair',
                quantity: 1,
                price: 449.99,
                total: 449.99
            }
        ],
        createdAt: '2024-01-25T16:20:00Z',
        shippingAddress: {
            street: '321 Elm St',
            city: 'Miami',
            state: 'FL',
            zip: '33101',
            country: 'USA'
        }
    }
];