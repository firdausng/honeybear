<script lang="ts">
    import StickyModeToggle from "$lib/components/sticky-mode-toggle.svelte";
    import { stickyModeStore } from "$lib/sticky-mode.svelte";

    let { data } = $props();
</script>

<!--<h1>Welcome to SvelteKit</h1>-->
<!--<pre>-->
<!--    {JSON.stringify(data.activeUser, null, 2)}-->
<!--</pre>-->

<div class="flex flex-col h-full">
    <!-- Header -->
    <div class="{stickyModeStore.isSticky ? 'sticky top-0 bg-background/95 backdrop-blur-sm border-b border-border-card z-10' : ''} {stickyModeStore.isSticky ? 'pb-4' : 'pb-6'}">
        <!-- Page Header -->
        <div class="flex items-center justify-between">
            <div class="{stickyModeStore.isSticky ? 'space-y-1' : 'space-y-0'}">
                <div class="flex items-center space-x-3">
                    <h1 class="{stickyModeStore.isSticky ? 'text-xl' : 'text-2xl'} font-bold text-foreground">Dashboard</h1>
                    <StickyModeToggle size="sm" showLabel={false} />
                </div>
                {#if !stickyModeStore.isSticky}
                    <p class="text-foreground-alt">Welcome back! Here's what's happening with your business</p>
                {/if}
            </div>
        </div>
    </div>

    <!-- Scrollable Content -->
    <div class="flex-1 space-y-6">
    <!--    Stats Grid -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        <!--{@render StatCard({-->
        <!--    title: "Total Users",-->
        <!--    value: "1,234",-->
        <!--    change: 12.5,-->
        <!--    icon: someIconSnippet,-->
        <!--    color: "bg-blue-100"-->
        <!--})}-->
<!--        <StatCard-->
<!--                title="Total Revenue"-->
<!--                value={`$${stats.totalRevenue.toLocaleString()}`}-->
<!--                change={stats.revenueChange}-->
<!--                icon={<DollarSign class="w-6 h-6 text-white" />}-->
<!--                color="bg-blue-500"-->
<!--        />-->
<!--        <StatCard-->
<!--                title="Total Orders"-->
<!--                value={stats.totalOrders}-->
<!--                change={stats.ordersChange}-->
<!--                icon={<ShoppingCart class="w-6 h-6 text-white" />}-->
<!--                color="bg-green-500"-->
<!--        />-->
<!--        <StatCard-->
<!--                title="Total Products"-->
<!--                value={stats.totalProducts}-->
<!--                icon={<Package class="w-6 h-6 text-white" />}-->
<!--                color="bg-purple-500"-->
<!--        />-->
<!--        <StatCard-->
<!--                title="Total Customers"-->
<!--                value={stats.totalCustomers}-->
<!--                icon={<Users class="w-6 h-6 text-white" />}-->
<!--                color="bg-orange-500"-->
<!--        />-->
    </div>

    <!--  Recent Orders  -->
    <div class="bg-background-alt rounded-xl shadow-sm border border-border-card theme-transition">
        <div class="px-6 py-4 border-b border-border-card theme-transition">
            <h3 class="text-lg font-semibold text-foreground theme-transition">Recent Orders</h3>
        </div>
        <div class="overflow-x-auto">
            <table class="w-full theme-transition">
                <thead class="bg-muted theme-transition">
                <tr>
                    <th class="px-6 py-3 text-left text-xs font-medium text-foreground-alt uppercase tracking-wider">
                        Order ID
                    </th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-foreground-alt uppercase tracking-wider">
                        Customer
                    </th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-foreground-alt uppercase tracking-wider">
                        Total
                    </th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-foreground-alt uppercase tracking-wider">
                        Status
                    </th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-foreground-alt uppercase tracking-wider">
                        Date
                    </th>
                </tr>
                </thead>
                <tbody class="bg-background-alt divide-y divide-border-card theme-transition">
                {#each data.orders as order (order.id)}
                    <tr class="hover:bg-muted theme-transition-fast">
                        <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-foreground">
                            {order.id}
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap">
                            <div>
                                <div class="text-sm font-medium text-foreground">{order.customerName}</div>
                                <div class="text-sm text-foreground-alt">{order.customerEmail}</div>
                            </div>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm font-semibold text-foreground">
                            ${order.total.toFixed(2)}
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap">
                    <span class={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        order.status === 'delivered' ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400' :
                            order.status === 'shipped' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400' :
                                order.status === 'processing' ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400' :
                                    order.status === 'pending' ? 'bg-muted text-foreground' :
                                        'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400'
                    }`}>
                      {order.status}
                    </span>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-foreground-alt">
                            {new Date(order.createdAt).toLocaleDateString()}
                        </td>
                    </tr>
                {/each}
                </tbody>
            </table>
        </div>
    </div>
    </div>
</div>

{#snippet StatCard({ title, value, change, icon, color }: {
    title: string;
    value: string | number;
    change?: number;
    icon: import('svelte').Snippet;
    color: string;
})}
    {@const isPositive = change && change > 0}

    <div class="bg-background-alt rounded-xl shadow-sm p-6 border border-border-card theme-transition">
        <div class="flex items-center justify-between">
            <div>
                <p class="text-sm font-medium text-foreground-alt">{title}</p>
                <p class="text-2xl font-bold text-foreground mt-2">{value}</p>
                {#if change !== undefined}
                    <div class="flex items-center mt-2 {isPositive ? 'text-green-600' : 'text-red-600'}">
                        {#if isPositive}
                            <!-- TrendingUp icon -->
                            <svg class="w-4 h-4 mr-1 theme-transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/>
                            </svg>
                        {:else}
                            <!-- TrendingDown icon -->
                            <svg class="w-4 h-4 mr-1 theme-transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"/>
                            </svg>
                        {/if}
                        <span class="text-sm font-medium">{Math.abs(change)}%</span>
                    </div>
                {/if}
            </div>
            <div class="w-12 h-12 {color} rounded-lg flex items-center justify-center">
                {@render icon()}
            </div>
        </div>
    </div>
{/snippet}