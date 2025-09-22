<script lang="ts">
    import { Dialog, Label, Separator } from "bits-ui";
    import LockKeyOpen from "phosphor-svelte/lib/LockKeyOpen";
    import Package from "phosphor-svelte/lib/Package";
    // import Clock from "phosphor-svelte/lib/Clock.svelte";
    // import User from "phosphor-svelte/lib/User.svelte";
    // import MapPin from "phosphor-svelte/lib/MapPin.svelte";
    import X from "phosphor-svelte/lib/X";
    import Eye  from "phosphor-svelte/lib/Eye";

    let {order = $bindable()}: { order: Client.Order } = $props();

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'delivered': return 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 border-green-200 dark:border-green-800';
            case 'shipped': return 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400 border-blue-200 dark:border-blue-800';
            case 'processing': return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800';
            case 'pending': return 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-300 border-gray-200 dark:border-gray-700';
            case 'cancelled': return 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400 border-red-200 dark:border-red-800';
            default: return 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-300 border-gray-200 dark:border-gray-700';
        }
    };

    let isOpen = $state(false);
</script>

<button onclick={() => (isOpen = true)}>
    <Eye class="w-4 h-4" />
</button>
<Dialog.Root bind:open={isOpen}>
    <Dialog.Portal>
        <Dialog.Overlay
                class="data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/20"
        />
        <Dialog.Content
                class="rounded-xl bg-background shadow-popover data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 outline-hidden fixed left-[50%] top-[50%] z-50 w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] border border-border-card shadow-lg p-5 md:w-full max-h-[90vh] flex flex-col"
        >
            <Dialog.Title
                    class="flex w-full items-center justify-center text-lg font-semibold tracking-tight flex-shrink-0"
            >
                <div>
                    <h2 class="text-xl font-semibold text-gray-900 dark:text-white">Order Details</h2>
                    <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">Order ID: {order.id}</p>
                </div>
            </Dialog.Title>
            <Separator.Root class="bg-muted -mx-5 mb-6 mt-5 block h-px flex-shrink-0" />

            <!-- Scrollable content area -->
            <div class="flex-1 overflow-y-auto min-h-0">
                <div class="space-y-6">
                    <!-- Order Overview -->
                    <div class="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
                        <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                            <div class="flex items-center space-x-2 mb-2">
                                <!--                                    <Clock class="w-4 h-4 text-gray-500" />-->
                                <h3 class="font-medium text-gray-900 dark:text-white">Order Status</h3>
                            </div>
                            <span class={`inline-flex px-3 py-1 text-sm font-semibold rounded-full border ${getStatusColor(order.status)}`}>
                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
              </span>
                            <p class="text-sm text-gray-500 dark:text-gray-400 mt-2">
                                Placed on {new Date(order.createdAt).toLocaleDateString()}
                            </p>
                        </div>

                        <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                            <div class="flex items-center space-x-2 mb-2">
                                <!--                                    <User class="w-4 h-4 text-gray-500" />-->
                                <h3 class="font-medium text-gray-900 dark:text-white">Customer</h3>
                            </div>
                            <p class="text-sm text-gray-900 dark:text-white">{order.customerName}</p>
                            <p class="text-sm text-gray-500 dark:text-gray-400">{order.customerEmail}</p>
                        </div>

                        <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                            <div class="flex items-center space-x-2 mb-2">
                                <Package class="w-4 h-4 text-gray-500" />
                                <h3 class="font-medium text-gray-900 dark:text-white">Order Total</h3>
                            </div>
                            <p class="text-2xl font-bold text-gray-900 dark:text-white">${order.total.toFixed(2)}</p>
                            <p class="text-sm text-gray-500 dark:text-gray-400">{order.items.length} item{order.items.length !== 1 ? 's' : ''}</p>
                        </div>
                    </div>

                    <!-- Shipping Address  -->
                    <div class="bg-background-alt border border-border-card rounded-lg p-4">
                        <div class="flex items-center space-x-2 mb-3">
                            <!--                                <MapPin class="w-4 h-4 text-gray-500" />-->
                            <h3 class="font-medium text-gray-900 dark:text-white">Shipping Address</h3>
                        </div>
                        <div class="text-sm text-gray-600 dark:text-gray-300">
                            <p>{order.shippingAddress.street}</p>
                            <p>
                                {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zip}
                            </p>
                            <p>{order.shippingAddress.country}</p>
                        </div>
                    </div>

                    <!-- Order Items -->
                    <div class="bg-background-alt border border-border-card rounded-lg overflow-hidden">
                        <div class="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                            <h3 class="font-medium text-gray-900 dark:text-white">Order Items</h3>
                        </div>
                        <div class="divide-y divide-gray-200 dark:divide-gray-700">
                            {#each order.items as item,index (index)}
                                <div class="px-4 py-4 flex items-center justify-between">
                                    <div class="flex-1">
                                        <h4 class="text-sm font-medium text-gray-900 dark:text-white">{item.productName}</h4>
                                        <p class="text-sm text-gray-500 dark:text-gray-400">Quantity: {item.quantity}</p>
                                    </div>
                                    <div class="text-right">
                                        <p class="text-sm font-medium text-gray-900 dark:text-white">${item.total.toFixed(2)}</p>
                                        <p class="text-xs text-gray-500 dark:text-gray-400">${item.price.toFixed(2)} each</p>
                                    </div>
                                </div>
                            {/each}
                        </div>
                        <div class="px-4 py-3 bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-700">
                            <div class="flex justify-between items-center">
                                <span class="font-medium text-gray-900 dark:text-white">Total</span>
                                <span class="text-lg font-bold text-gray-900 dark:text-white">${order.total.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Fixed footer with close button -->
            <div class="flex w-full justify-end pt-4 flex-shrink-0">
                <Dialog.Close
                        class="h-input rounded-input bg-accent text-accent-foreground shadow-mini hover:bg-accent focus-visible:ring-accent focus-visible:ring-offset-background focus-visible:outline-hidden inline-flex items-center justify-center px-[50px] text-[15px] font-semibold focus-visible:ring-2 focus-visible:ring-offset-2 active:scale-[0.98]"
                >
                    Close
                </Dialog.Close>
            </div>
            <Dialog.Close
                    class="focus-visible:ring-accent focus-visible:ring-offset-background focus-visible:outline-hidden absolute right-5 top-5 rounded-md focus-visible:ring-2 focus-visible:ring-offset-2 active:scale-[0.98]"
            >
                <div>
                    <X class="text-foreground size-5" />
                    <span class="sr-only">Close</span>
                </div>
            </Dialog.Close>
        </Dialog.Content>
    </Dialog.Portal>
</Dialog.Root>