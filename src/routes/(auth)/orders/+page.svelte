<script lang="ts">
    import MagnifyingGlass from "phosphor-svelte/lib/MagnifyingGlass";
    import ShoppingCartSimple from "phosphor-svelte/lib/ShoppingCartSimple";

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

    const statuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'delivered': return 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400';
            case 'shipped': return 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400';
            case 'processing': return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400';
            case 'pending': return 'bg-muted text-foreground-alt';
            case 'cancelled': return 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400';
            default: return 'bg-muted text-foreground-alt';
        }
    };

</script>

<div class="space-y-6 theme-transition">
<!--  Header Actions  -->
    <div class="flex flex-col space-y-4 sm:flex-row sm:items-center sm:space-y-0 sm:space-x-4">
        <div class="relative theme-transition">
            <MagnifyingGlass class="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4 theme-transition" />
            <input
                    type="text"
                    placeholder="Search orders..."
                    bind:value={searchTerm}
                    class="pl-10 pr-4 py-2 border border-border-input bg-background-alt text-foreground placeholder:text-muted-foreground rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full sm:w-80 theme-transition"
            />
        </div>

        <select
                bind:value={statusFilter}
                class="px-4 py-2 border border-border-input bg-background-alt text-foreground rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full sm:w-auto theme-transition"
        >
            <option value="all">
                All Statuses
            </option>
            {#each statuses as status(status)}
                <option value={status}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                </option>
            {/each}
        </select>
    </div>

<!--  Orders Table  -->
    <div class="bg-background-alt rounded-xl shadow-sm border border-border-card overflow-hidden theme-transition">
        <div class="overflow-x-auto -mx-4 sm:mx-0">
            <table class="w-full theme-transition">
                <thead class="bg-muted theme-transition">
                <tr>
                    <th class="px-3 sm:px-6 py-3 text-left text-xs font-medium text-foreground-alt uppercase tracking-wider">
                        Order Details
                    </th>
                    <th class="px-3 sm:px-6 py-3 text-left text-xs font-medium text-foreground-alt uppercase tracking-wider hidden sm:table-cell">
                        Customer
                    </th>
                    <th class="px-3 sm:px-6 py-3 text-left text-xs font-medium text-foreground-alt uppercase tracking-wider">
                        Items
                    </th>
                    <th class="px-3 sm:px-6 py-3 text-left text-xs font-medium text-foreground-alt uppercase tracking-wider">
                        Total
                    </th>
                    <th class="px-3 sm:px-6 py-3 text-left text-xs font-medium text-foreground-alt uppercase tracking-wider">
                        Status
                    </th>
                    <th class="px-3 sm:px-6 py-3 text-left text-xs font-medium text-foreground-alt uppercase tracking-wider">
                        Actions
                    </th>
                </tr>
                </thead>
                <tbody class="bg-background-alt divide-y divide-border-card theme-transition">
                {#each filteredOrders as order(order.id)}
                    <tr class="hover:bg-muted theme-transition-fast">
                        <td class="px-3 sm:px-6 py-4">
                            <div>
                                <div class="text-sm font-medium text-foreground">{order.id}</div>
                                <div class="text-sm text-foreground-alt sm:hidden">
                                    {order.customerName}
                                </div>
                                <div class="text-sm text-foreground-alt hidden sm:block">
                                    {new Date(order.createdAt).toLocaleDateString()}
                                </div>
                            </div>
                        </td>
                        <td class="px-3 sm:px-6 py-4 whitespace-nowrap hidden sm:table-cell">
                            <div>
                                <div class="text-sm font-medium text-foreground">{order.customerName}</div>
                                <div class="text-sm text-foreground-alt">{order.customerEmail}</div>
                            </div>
                        </td>
                        <td class="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-foreground">
                            {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                        </td>
                        <td class="px-3 sm:px-6 py-4 whitespace-nowrap text-sm font-semibold text-foreground">
                            ${order.total.toFixed(2)}
                        </td>
                        <td class="px-3 sm:px-6 py-4 whitespace-nowrap">
                            <span class={`text-xs font-semibold rounded-full px-2 py-1 border-0 focus:outline-none focus:ring-2 focus:ring-accent w-full sm:w-auto theme-transition ${getStatusColor(order.status)}`}>
                               {order.status} 
                            </span>
                        </td>
                        <td class="px-3 sm:px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                            <OrderDetail order={order} />
                        </td>
                    </tr>    
                {/each}
                </tbody>
            </table>
        </div>
    </div>

    {#if filteredOrders.length === 0}
        <div class="text-center py-12">
            <div class="mx-auto h-12 w-12 text-muted-foreground">
                <ShoppingCartSimple class="w-full h-full theme-transition" />
            </div>
            <h3 class="mt-2 text-sm font-medium text-foreground">No orders found</h3>
            <p class="mt-1 text-sm text-foreground-alt">
                {searchTerm || statusFilter !== 'all'
                    ? 'Try adjusting your search or filter criteria'
                    : 'Orders will appear here when customers make purchases'
                }
            </p>
        </div>
    {/if}
</div>