<script lang="ts">
    import {authManager} from "$lib/auth-data.svelte";
    
   const abc = {
       title: "Total Orders",
       
   }
    
    let { data } = $props();
</script>

<!--<h1>Welcome to SvelteKit</h1>-->
<!--<pre>-->
<!--    {JSON.stringify(data.activeUser, null, 2)}-->
<!--</pre>-->

<div class="space-y-6">
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
    <div class="bg-primary-50 dark:bg-primary-900 rounded-xl shadow-sm border border-primary-100 dark:border-primary-800">
        <div class="px-6 py-4 border-b border-primary-200 dark:border-primary-800">
            <h3 class="text-lg font-semibold text-primary-900 dark:text-primary-50">Recent Orders</h3>
        </div>
        <div class="overflow-x-auto">
            <table class="w-full">
                <thead class="bg-primary-100 dark:bg-primary-800">
                <tr>
                    <th class="px-6 py-3 text-left text-xs font-medium text-primary-500 dark:text-primary-200 uppercase tracking-wider">
                        Order ID
                    </th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-primary-500 dark:text-primary-200 uppercase tracking-wider">
                        Customer
                    </th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-primary-500 dark:text-primary-200 uppercase tracking-wider">
                        Total
                    </th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-primary-500 dark:text-primary-200 uppercase tracking-wider">
                        Status
                    </th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-primary-500 dark:text-primary-200 uppercase tracking-wider">
                        Date
                    </th>
                </tr>
                </thead>
                <tbody class="bg-primary-50 dark:bg-primary-900 divide-y divide-primary-200 dark:divide-primary-800">
                {#each data.orders as order (order.id)}
                    <tr class="hover:bg-primary-50 dark:hover:bg-primary-800">
                        <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-primary-900 dark:text-primary-50">
                            {order.id}
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap">
                            <div>
                                <div class="text-sm font-medium text-primary-900 dark:text-primary-50">{order.customerName}</div>
                                <div class="text-sm text-primary-500 dark:text-primary-200">{order.customerEmail}</div>
                            </div>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm font-semibold text-primary-900 dark:text-primary-50">
                            ${order.total.toFixed(2)}
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap">
                    <span class={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        order.status === 'delivered' ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400' :
                            order.status === 'shipped' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400' :
                                order.status === 'processing' ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400' :
                                    order.status === 'pending' ? 'bg-primary-100 dark:bg-secondary-800 text-primary-800 dark:text-secondary-200' :
                                        'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400'
                    }`}>
                      {order.status}
                    </span>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-primary-500 dark:text-primary-200">
                            {new Date(order.createdAt).toLocaleDateString()}
                        </td>
                    </tr>
                {/each}
                </tbody>
            </table>
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

    <div class="bg-primary-50 dark:bg-primary-900 rounded-xl shadow-sm p-6 border border-primary-100 dark:border-primary-800">
        <div class="flex items-center justify-between">
            <div>
                <p class="text-sm font-medium text-primary-600 dark:text-primary-200">{title}</p>
                <p class="text-2xl font-bold text-primary-900 dark:text-primary-50 mt-2">{value}</p>
                {#if change !== undefined}
                    <div class="flex items-center mt-2 {isPositive ? 'text-green-600' : 'text-red-600'}">
                        {#if isPositive}
                            <!-- TrendingUp icon -->
                            <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/>
                            </svg>
                        {:else}
                            <!-- TrendingDown icon -->
                            <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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