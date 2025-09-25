<script lang="ts">
    import MagnifyingGlass from "phosphor-svelte/lib/MagnifyingGlass";
    import ShoppingCartSimple from "phosphor-svelte/lib/ShoppingCartSimple";
    import StickyModeToggle from "$lib/components/sticky-mode-toggle.svelte";
    import { Select } from "bits-ui";
    import Check from "phosphor-svelte/lib/Check";
    import ListChecks from "phosphor-svelte/lib/ListChecks";
    import CaretUpDown from "phosphor-svelte/lib/CaretUpDown";
    import CaretDoubleUp from "phosphor-svelte/lib/CaretDoubleUp";
    import CaretDoubleDown from "phosphor-svelte/lib/CaretDoubleDown";
    import { stickyModeStore } from "$lib/sticky-mode.svelte";

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

    let statusOptions = $derived([
        { value: 'all', label: 'All Status', disabled: false },
        { value: 'pending', label: 'Pending', disabled: false },
        { value: 'processing', label: 'Processing', disabled: false },
        { value: 'shipped', label: 'Shipped', disabled: false },
        { value: 'delivered', label: 'Delivered', disabled: false },
        { value: 'cancelled', label: 'Cancelled', disabled: false }
    ]);

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

<div class="flex flex-col h-full">
    <!-- Header and Filters -->
    <div class="{stickyModeStore.isSticky ? 'sticky top-0 bg-background/95 backdrop-blur-sm border-b border-border-card z-10' : ''} {stickyModeStore.isSticky ? 'py-2 px-4' : 'pb-6 space-y-6'}">
        {#if stickyModeStore.isSticky}
            <!-- Compact Header and Filters in Same Row -->
            <div class="flex items-center justify-between gap-4">
                <!-- Left: Title and Toggle -->
                <div class="flex items-center space-x-3 flex-shrink-0">
                    <h1 class="text-lg font-bold text-foreground">Orders</h1>
                    <StickyModeToggle size="sm" showLabel={false} />
                </div>

                <!-- Right: Compact Filters -->
                <div class="flex items-center gap-2 flex-1 justify-end">
                    <!-- Search -->
                    <div class="relative">
                        <input
                            type="text"
                            placeholder="Search orders..."
                            bind:value={searchTerm}
                            class="w-56 pl-8 pr-3 py-1.5 text-sm border border-border-input rounded-md bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-1 focus:ring-accent/20 focus:border-accent theme-transition"
                        />
                        <MagnifyingGlass class="absolute left-2.5 top-1/2 transform -translate-y-1/2 w-3 h-3 text-muted-foreground theme-transition" />
                    </div>

                    <!-- Status Filter -->
                    <Select.Root
                        type="single"
                        onValueChange={(v) => statusFilter = v || 'all'}
                        items={statusOptions}
                        allowDeselect={true}
                    >
                        <Select.Trigger
                            class="h-[34px] rounded-md border-border-input bg-background data-placeholder:text-foreground-alt/50 inline-flex w-[150px] touch-none select-none items-center border px-3 text-sm transition-colors"
                            aria-label="Select Status"
                        >
                            <ListChecks class="text-muted-foreground mr-2 size-4 flex-shrink-0" />
                            <span class="truncate whitespace-nowrap flex-1 min-w-0">
                                {statusOptions.find(opt => opt.value === statusFilter)?.label || 'All Status'}
                            </span>
                            <CaretUpDown class="text-muted-foreground ml-2 size-4 flex-shrink-0" />
                        </Select.Trigger>
                        <Select.Portal>
                            <Select.Content
                                class="focus-override border-muted bg-background shadow-popover data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 outline-hidden z-50 max-h-[var(--bits-select-content-available-height)] w-[var(--bits-select-anchor-width)] min-w-[var(--bits-select-anchor-width)] select-none rounded-xl border px-1 py-3 data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1"
                                sideOffset={10}
                            >
                                <Select.ScrollUpButton class="flex w-full items-center justify-center">
                                    <CaretDoubleUp class="size-3" />
                                </Select.ScrollUpButton>
                                <Select.Viewport class="p-1">
                                    {#each statusOptions as { value, label, disabled } (value)}
                                        <Select.Item
                                            class="rounded-button data-highlighted:bg-muted outline-hidden data-disabled:opacity-50 flex h-10 w-full select-none items-center py-3 pl-5 pr-1.5 text-sm capitalize"
                                            {value} {label} {disabled}
                                        >
                                            {#snippet children({ selected })}
                                                {label}
                                                {#if selected}
                                                    <div class="ml-auto">
                                                        <Check aria-label="check" />
                                                    </div>
                                                {/if}
                                            {/snippet}
                                        </Select.Item>
                                    {/each}
                                    <Select.ScrollDownButton class="flex w-full items-center justify-center">
                                        <CaretDoubleDown class="size-3" />
                                    </Select.ScrollDownButton>
                                </Select.Viewport>
                            </Select.Content>
                        </Select.Portal>
                    </Select.Root>
                </div>
            </div>
        {:else}
            <!-- Normal Layout -->
            <div class="space-y-6">
                <!-- Page Header -->
                <div class="flex items-center justify-between">
                    <div>
                        <div class="flex items-center space-x-3">
                            <h1 class="text-2xl font-bold text-foreground">Orders</h1>
                            <StickyModeToggle size="sm" showLabel={false} />
                        </div>
                        <p class="text-foreground-alt">Monitor and manage customer orders</p>
                    </div>
                </div>

                <!-- Header Actions -->
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

                    <Select.Root
                        type="single"
                        onValueChange={(v) => statusFilter = v || 'all'}
                        items={statusOptions}
                        allowDeselect={true}
                    >
                        <Select.Trigger
                            class="h-[42px] rounded-lg border-border-input bg-background data-placeholder:text-foreground-alt/50 inline-flex w-[180px] touch-none select-none items-center border px-4 text-sm transition-colors"
                            aria-label="Select Status"
                        >
                            <ListChecks class="text-muted-foreground mr-2 size-5 flex-shrink-0" />
                            <span class="truncate whitespace-nowrap flex-1 min-w-0">
                                {statusOptions.find(opt => opt.value === statusFilter)?.label || 'All Status'}
                            </span>
                            <CaretUpDown class="text-muted-foreground ml-2 size-5 flex-shrink-0" />
                        </Select.Trigger>
                        <Select.Portal>
                            <Select.Content
                                class="focus-override border-muted bg-background shadow-popover data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 outline-hidden z-50 max-h-[var(--bits-select-content-available-height)] w-[var(--bits-select-anchor-width)] min-w-[var(--bits-select-anchor-width)] select-none rounded-xl border px-1 py-3 data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1"
                                sideOffset={10}
                            >
                                <Select.ScrollUpButton class="flex w-full items-center justify-center">
                                    <CaretDoubleUp class="size-3" />
                                </Select.ScrollUpButton>
                                <Select.Viewport class="p-1">
                                    {#each statusOptions as { value, label, disabled } (value)}
                                        <Select.Item
                                            class="rounded-button data-highlighted:bg-muted outline-hidden data-disabled:opacity-50 flex h-10 w-full select-none items-center py-3 pl-5 pr-1.5 text-sm capitalize"
                                            {value} {label} {disabled}
                                        >
                                            {#snippet children({ selected })}
                                                {label}
                                                {#if selected}
                                                    <div class="ml-auto">
                                                        <Check aria-label="check" />
                                                    </div>
                                                {/if}
                                            {/snippet}
                                        </Select.Item>
                                    {/each}
                                    <Select.ScrollDownButton class="flex w-full items-center justify-center">
                                        <CaretDoubleDown class="size-3" />
                                    </Select.ScrollDownButton>
                                </Select.Viewport>
                            </Select.Content>
                        </Select.Portal>
                    </Select.Root>
                </div>
            </div>
        {/if}
    </div>

    <!-- Scrollable Orders Content -->
    <div class="flex-1 {stickyModeStore.isSticky ? 'space-y-3 px-4 py-2' : 'space-y-6'}">
        <!-- Orders Table -->
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
</div>