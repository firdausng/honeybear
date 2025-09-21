<script lang="ts">
    import List from "phosphor-svelte/lib/List";
    import MagnifyingGlass from "phosphor-svelte/lib/MagnifyingGlass";
    import Plus from "phosphor-svelte/lib/Plus";
    import PencilLine from "phosphor-svelte/lib/PencilLine";
    import Trash from "phosphor-svelte/lib/Trash";
    import Package from "phosphor-svelte/lib/Package";
    import ShoppingCartSimple from "phosphor-svelte/lib/ShoppingCartSimple";
    import UserSquare  from "phosphor-svelte/lib/UserSquare";
    import Eye  from "phosphor-svelte/lib/Eye";
    import OrderDetail from "./order-detail.svelte";
    
    let { data } = $props();
    
    let searchTerm = $state("");
    let statusFilter = $state("all");
    
    let filteredOrders = $derived.by(()=>{
        return data.orders.filter((order) => {
            const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                order.customerEmail.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
            return matchesSearch && matchesStatus;
        });
    });

    const statuses = ['all', 'pending', 'processing', 'shipped', 'delivered', 'cancelled'];

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'delivered': return 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400';
            case 'shipped': return 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400';
            case 'processing': return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400';
            case 'pending': return 'bg-primary-100 dark:bg-secondary-800 text-primary-800 dark:text-secondary-200';
            case 'cancelled': return 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400';
            default: return 'bg-primary-100 dark:bg-secondary-800 text-primary-800 dark:text-secondary-200';
        }
    };

    const updateOrderStatus = (orderId: string, newStatus: string) => {
        // In a real app, this would make an API call
        console.log(`Updating order ${orderId} to status ${newStatus}`);
    };

</script>

<div class="space-y-6">
<!--  Header Actions  -->
    <div class="flex flex-col space-y-4 sm:flex-row sm:items-center sm:space-y-0 sm:space-x-4">
        <div class="relative">
            <MagnifyingGlass class="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary-400 dark:text-primary-300 w-4 h-4" />
            <input
                    type="text"
                    placeholder="Search orders..."
                    bind:value={searchTerm}
                    class="pl-10 pr-4 py-2 border border-primary-300 dark:border-primary-700 dark:bg-primary-900 dark:text-primary-50 dark:placeholder-primary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full sm:w-80"
            />
        </div>

        <select
                bind:value={statusFilter}
                class="px-4 py-2 border border-primary-300 dark:border-primary-700 dark:bg-primary-900 dark:text-primary-50 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full sm:w-auto"
        >
            {#each statuses as status(status)}
                <option value={status}>
                    {status === 'all' ? 'All Statuses' : status.charAt(0).toUpperCase() + status.slice(1)}
                </option>
            {/each}
        </select>
    </div>

<!--  Orders Table  -->
    <div class="bg-primary-50 dark:bg-primary-900 rounded-xl shadow-sm border border-primary-100 dark:border-primary-800 overflow-hidden">
        <div class="overflow-x-auto -mx-4 sm:mx-0">
            <table class="w-full">
                <thead class="bg-primary-100 dark:bg-primary-800">
                <tr>
                    <th class="px-3 sm:px-6 py-3 text-left text-xs font-medium text-primary-500 dark:text-primary-200 uppercase tracking-wider">
                        Order Details
                    </th>
                    <th class="px-3 sm:px-6 py-3 text-left text-xs font-medium text-primary-500 uppercase tracking-wider hidden sm:table-cell">
                        Customer
                    </th>
                    <th class="px-3 sm:px-6 py-3 text-left text-xs font-medium text-primary-500 dark:text-primary-200 uppercase tracking-wider">
                        Items
                    </th>
                    <th class="px-3 sm:px-6 py-3 text-left text-xs font-medium text-primary-500 dark:text-primary-200 uppercase tracking-wider">
                        Total
                    </th>
                    <th class="px-3 sm:px-6 py-3 text-left text-xs font-medium text-primary-500 dark:text-primary-200 uppercase tracking-wider">
                        Status
                    </th>
                    <th class="px-3 sm:px-6 py-3 text-left text-xs font-medium text-primary-500 dark:text-primary-200 uppercase tracking-wider">
                        Actions
                    </th>
                </tr>
                </thead>
                <tbody class="bg-primary-50 dark:bg-primary-900 divide-y divide-primary-200 dark:divide-primary-800">
                {#each filteredOrders as order(order.id)}
                    <tr class="hover:bg-primary-50 dark:hover:bg-primary-800">
                        <td class="px-3 sm:px-6 py-4">
                            <div>
                                <div class="text-sm font-medium text-primary-900 dark:text-primary-50">{order.id}</div>
                                <div class="text-sm text-primary-500 dark:text-primary-200 sm:hidden">
                                    {order.customerName}
                                </div>
                                <div class="text-sm text-primary-500 dark:text-primary-200 hidden sm:block">
                                    {new Date(order.createdAt).toLocaleDateString()}
                                </div>
                            </div>
                        </td>
                        <td class="px-3 sm:px-6 py-4 whitespace-nowrap hidden sm:table-cell">
                            <div>
                                <div class="text-sm font-medium text-primary-900 dark:text-primary-50">{order.customerName}</div>
                                <div class="text-sm text-primary-500 dark:text-primary-200">{order.customerEmail}</div>
                            </div>
                        </td>
                        <td class="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-primary-900 dark:text-primary-50">
                            {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                        </td>
                        <td class="px-3 sm:px-6 py-4 whitespace-nowrap text-sm font-semibold text-primary-900 dark:text-primary-50">
                            ${order.total.toFixed(2)}
                        </td>
                        <td class="px-3 sm:px-6 py-4 whitespace-nowrap">
                            <select
                                    value={order.status}
                                    onchange={(e) => updateOrderStatus(order.id, e.target.value)}
                                    class={`text-xs font-semibold rounded-full px-2 py-1 border-0 focus:outline-none focus:ring-2 focus:ring-secondary-500 w-full sm:w-auto ${getStatusColor(order.status)}`}
                            >
                                <option value="pending">Pending</option>
                                <option value="processing">Processing</option>
                                <option value="shipped">Shipped</option>
                                <option value="delivered">Delivered</option>
                                <option value="cancelled">Cancelled</option>
                            </select>
                        </td>
                        <td class="px-3 sm:px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                            <OrderDetail order={order} />
<!--                            <button-->
<!--                                    onclick={() => onViewOrder(order)}-->
<!--                                    class="text-blue-600 hover:text-blue-900 transition-colors"-->
<!--                            >-->
<!--                                <Eye class="w-4 h-4" />-->
<!--                            </button>-->
                        </td>
                    </tr>    
                {/each}
                </tbody>
            </table>
        </div>
    </div>

    {#if filteredOrders.length === 0}
        <div class="text-center py-12">
            <div class="mx-auto h-12 w-12 text-primary-400 dark:text-primary-300">
                <ShoppingCartSimple class="w-full h-full" />
            </div>
            <h3 class="mt-2 text-sm font-medium text-primary-900 dark:text-primary-50">No orders found</h3>
            <p class="mt-1 text-sm text-primary-500 dark:text-primary-200">
                {searchTerm || statusFilter !== 'all'
                    ? 'Try adjusting your search or filter criteria'
                    : 'Orders will appear here when customers make purchases'
                }
            </p>
        </div>
    {/if}
</div>