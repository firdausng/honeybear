<script lang="ts">
    import CustomerFilters from "$lib/components/customers/CustomerFilters.svelte";
    import CustomerGrid from "$lib/components/customers/CustomerGrid.svelte";
    import CustomerTable from "$lib/components/customers/CustomerTable.svelte";
    import CustomerBulkActions from "$lib/components/customers/CustomerBulkActions.svelte";
    import StickyModeToggle from "$lib/components/sticky-mode-toggle.svelte";
    import { Select } from "bits-ui";
    import Users from "phosphor-svelte/lib/Users";
    import Check from "phosphor-svelte/lib/Check";
    import UserCheck from "phosphor-svelte/lib/UserCheck";
    import CaretUpDown from "phosphor-svelte/lib/CaretUpDown";
    import CaretDoubleUp from "phosphor-svelte/lib/CaretDoubleUp";
    import CaretDoubleDown from "phosphor-svelte/lib/CaretDoubleDown";
    import { page } from '$app/state';
    import { goto } from '$app/navigation';
    import { stickyModeStore } from "$lib/sticky-mode.svelte";

    let { data } = $props();

    // Get initial values from URL search params, default to table view
    let searchTerm = $state(page.url.searchParams.get('search') || '');
    let statusFilter = $state(page.url.searchParams.get('status') || 'all');
    let viewMode = $state<'grid' | 'list'>((page.url.searchParams.get('view') as 'grid' | 'list') || 'list');
    let customers = $state(data.customers);
    let selectedCustomerIds = $state<Set<string>>(new Set());

    let filteredCustomers = $derived.by(() => {
        return customers.filter((customer) => {
            const matchesSearch = customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                customer.email.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesStatus = statusFilter === 'all' || customer.status === statusFilter;
            return matchesSearch && matchesStatus;
        });
    });

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'active': return 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400';
            case 'inactive': return 'bg-muted text-foreground-alt';
            default: return 'bg-muted text-foreground-alt';
        }
    };

    const onEditCustomer = (customer: Client.Customer) => {
        console.log('Edit customer:', customer);
        // TODO: Open edit modal
    };

    const onViewCustomer = (customer: Client.Customer) => {
        console.log('View customer:', customer);
        // TODO: Navigate to customer detail page
    };

    const onAddCustomer = () => {
        console.log('Add new customer');
        // TODO: Open add customer modal
    };

    // Multi-select functions
    const toggleCustomerSelection = (customerId: string) => {
        const newSet = new Set(selectedCustomerIds);
        if (newSet.has(customerId)) {
            newSet.delete(customerId);
        } else {
            newSet.add(customerId);
        }
        selectedCustomerIds = newSet;
    };

    const toggleSelectAll = () => {
        if (selectedCustomerIds.size === filteredCustomers.length) {
            selectedCustomerIds = new Set();
        } else {
            selectedCustomerIds = new Set(filteredCustomers.map(c => c.id));
        }
    };

    const clearSelection = () => {
        selectedCustomerIds = new Set();
    };

    const onBulkEmail = () => {
        console.log('Bulk email customers:', Array.from(selectedCustomerIds));
        // TODO: Implement bulk email functionality
    };

    const onBulkExport = () => {
        console.log('Bulk export customers:', Array.from(selectedCustomerIds));
        // TODO: Implement bulk export functionality
    };

    const onBulkDeactivate = () => {
        console.log('Bulk deactivate customers:', Array.from(selectedCustomerIds));
        // TODO: Implement bulk deactivate functionality
    };

    let statusOptions = $derived([
        { value: 'all', label: 'All Status', disabled: false },
        { value: 'active', label: 'Active', disabled: false },
        { value: 'inactive', label: 'Inactive', disabled: false }
    ]);

    let isAllSelected = $derived(filteredCustomers.length > 0 && selectedCustomerIds.size === filteredCustomers.length);
    let isIndeterminate = $derived(selectedCustomerIds.size > 0 && selectedCustomerIds.size < filteredCustomers.length);

    // Function to update URL with current state
    function updateURL() {
        const params = new URLSearchParams();

        if (searchTerm) params.set('search', searchTerm);
        if (statusFilter !== 'all') params.set('status', statusFilter);
        if (viewMode !== 'list') params.set('view', viewMode);

        const url = params.toString() ? `?${params.toString()}` : window.location.pathname;
        goto(url, { replaceState: true, noScroll: true });
    }

    // Function to handle view mode change
    function handleViewModeChange(newViewMode: 'grid' | 'list') {
        viewMode = newViewMode;
        updateURL();
    }

    // Function to handle search term change
    function handleSearchChange(newSearchTerm: string) {
        searchTerm = newSearchTerm;
        updateURL();
    }

    // Function to handle status filter change
    function handleStatusChange(newStatus: string) {
        statusFilter = newStatus;
        updateURL();
    }

    // React to URL changes (browser back/forward)
    $effect(() => {
        searchTerm = page.url.searchParams.get('search') || '';
        statusFilter = page.url.searchParams.get('status') || 'all';
        viewMode = (page.url.searchParams.get('view') as 'grid' | 'list') || 'list';
    });
</script>

<div class="flex flex-col h-full">
    <!-- Header and Filters -->
    <div class="{stickyModeStore.isSticky ? 'sticky top-0 bg-background/95 backdrop-blur-sm border-b border-border-card z-10' : ''} {stickyModeStore.isSticky ? 'py-2 px-4' : 'pb-6 space-y-6'}">
        {#if stickyModeStore.isSticky}
            <!-- Compact Header and Filters in Same Row -->
            <div class="flex items-center justify-between gap-4">
                <!-- Left: Title and Toggle -->
                <div class="flex items-center space-x-3 flex-shrink-0">
                    <h1 class="text-lg font-bold text-foreground">Customers</h1>
                    <StickyModeToggle size="sm" showLabel={false} />
                </div>

                <!-- Right: Compact Filters -->
                <div class="flex items-center gap-2 flex-1 justify-end">
                    <!-- Search -->
                    <div class="relative">
                        <input
                            type="text"
                            placeholder="Search..."
                            value={searchTerm}
                            oninput={(e) => handleSearchChange(e.currentTarget.value)}
                            class="w-48 pl-8 pr-3 py-1.5 text-sm border border-border-input rounded-md bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-1 focus:ring-accent/20 focus:border-accent theme-transition"
                        />
                        <svg class="absolute left-2.5 top-1/2 transform -translate-y-1/2 w-3 h-3 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m21 21-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                        </svg>
                    </div>

                    <!-- Status Filter -->
                    <Select.Root
                        type="single"
                        onValueChange={(v) => handleStatusChange(v || 'all')}
                        items={statusOptions}
                        allowDeselect={true}
                    >
                        <Select.Trigger
                            class="h-[34px] rounded-md border-border-input bg-background data-placeholder:text-foreground-alt/50 inline-flex w-[140px] touch-none select-none items-center border px-3 text-sm transition-colors"
                            aria-label="Select Status"
                        >
                            <UserCheck class="text-muted-foreground mr-2 size-4 flex-shrink-0" />
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

                    <!-- View Toggle -->
                    <div class="flex items-center bg-muted rounded-md p-0.5">
                        <button
                            class="flex items-center justify-center w-6 h-6 rounded text-xs transition-all duration-200 {viewMode === 'grid' ? 'bg-accent text-accent-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}"
                            onclick={() => handleViewModeChange('grid')}
                        >
                            <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path d="M4 4h4v4H4V4zm6 0h4v4h-4V4zm6 0h4v4h-4V4zM4 10h4v4H4v-4zm6 0h4v4h-4v-4zm6 0h4v4h-4v-4zM4 16h4v4H4v-4zm6 0h4v4h-4v-4zm6 0h4v4h-4v-4z"/></svg>
                        </button>
                        <button
                            class="flex items-center justify-center w-6 h-6 rounded text-xs transition-all duration-200 {viewMode === 'list' ? 'bg-accent text-accent-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}"
                            onclick={() => handleViewModeChange('list')}
                        >
                            <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path d="M4 6h16v2H4V6zm0 5h16v2H4v-2zm0 5h16v2H4v-2z"/></svg>
                        </button>
                    </div>

                    <!-- Add Button -->
                    <button
                        onclick={onAddCustomer}
                        class="bg-accent hover:bg-accent/90 text-accent-foreground px-2 py-1.5 rounded-md text-sm font-medium theme-transition-fast flex items-center gap-1"
                    >
                        <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
                        </svg>
                        Add
                    </button>
                </div>
            </div>
        {:else}
            <!-- Normal Layout -->
            <div class="space-y-6">
                <!-- Page Header -->
                <div class="flex items-center justify-between">
                    <div>
                        <div class="flex items-center space-x-3">
                            <h1 class="text-2xl font-bold text-foreground">Customers</h1>
                            <StickyModeToggle size="sm" showLabel={false} />
                        </div>
                        <p class="text-foreground-alt">Manage your customer database and relationships</p>
                    </div>
                </div>

                <!--  Header Filters  -->
                <CustomerFilters
                    {searchTerm}
                    {statusFilter}
                    {viewMode}
                    onSearchChange={handleSearchChange}
                    onStatusChange={handleStatusChange}
                    onViewModeChange={handleViewModeChange}
                    {onAddCustomer}
                />
            </div>
        {/if}
    </div>

    <!-- Scrollable Customer Display -->
    <div class="theme-transition transition-all duration-300 ease-in-out {stickyModeStore.isSticky ? 'px-4 py-2' : 'py-0'}">
        {#if viewMode === 'grid'}
            <div class="opacity-0 animate-[fadeIn_200ms_ease-in-out_forwards]">
                <CustomerGrid
                    customers={filteredCustomers}
                    {getStatusColor}
                    {onEditCustomer}
                    {onViewCustomer}
                />
            </div>
        {:else}
            <div class="opacity-0 animate-[fadeIn_200ms_ease-in-out_forwards]">
                <CustomerTable
                    customers={filteredCustomers}
                    {selectedCustomerIds}
                    {isAllSelected}
                    {isIndeterminate}
                    {getStatusColor}
                    onToggleSelectAll={toggleSelectAll}
                    onToggleCustomerSelection={toggleCustomerSelection}
                    {onEditCustomer}
                    {onViewCustomer}
                />
            </div>
        {/if}
    </div>

    <style>
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(4px); }
            to { opacity: 1; transform: translateY(0); }
        }
    </style>

    <!-- Empty State -->
    {#if filteredCustomers.length === 0}
        <div class="text-center py-12">
            <Users class="mx-auto h-12 w-12 text-muted-foreground theme-transition" />
            <h3 class="mt-2 text-sm font-medium text-foreground">No customers found</h3>
            <p class="mt-1 text-sm text-foreground-alt">
                {searchTerm || statusFilter !== 'all'
                    ? 'Try adjusting your search or filter criteria'
                    : 'Get started by adding your first customer'
                }
            </p>
        </div>
    {/if}

    <!-- Bulk Actions Toolbar -->
    {#if selectedCustomerIds.size > 0}
        <CustomerBulkActions
            selectedCount={selectedCustomerIds.size}
            onClearSelection={clearSelection}
            {onBulkEmail}
            {onBulkExport}
            {onBulkDeactivate}
        />
    {/if}
</div>
