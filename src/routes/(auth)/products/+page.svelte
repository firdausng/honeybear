<script lang="ts">
    import { Select, type WithoutChildren } from "bits-ui";
    import Package from "phosphor-svelte/lib/Package";
    import Check from "phosphor-svelte/lib/Check";
    import Funnel from "phosphor-svelte/lib/Funnel";
    import CaretUpDown from "phosphor-svelte/lib/CaretUpDown";
    import CaretDoubleUp from "phosphor-svelte/lib/CaretDoubleUp";
    import CaretDoubleDown from "phosphor-svelte/lib/CaretDoubleDown";
    import ProductForm from "$lib/components/product-form.svelte";
    import ProductFilters from "$lib/components/products/ProductFilters.svelte";
    import ProductGrid from "$lib/components/products/ProductGrid.svelte";
    import ProductTable from "$lib/components/products/ProductTable.svelte";
    import BulkActions from "$lib/components/products/BulkActions.svelte";
    import ProductModals from "$lib/components/products/ProductModals.svelte";
    import StickyModeToggle from "$lib/components/sticky-mode-toggle.svelte";
    import {page} from '$app/state';
    import {goto} from '$app/navigation';
    import {stickyModeStore} from "$lib/sticky-mode.svelte";

    let { data, form } = $props();

    // Get initial values from URL search params, default to table view
    let searchTerm = $state(page.url.searchParams.get('search') || '');
    let categoryFilter = $state(page.url.searchParams.get('category') || 'all');
    let viewMode = $state<'grid' | 'list'>((page.url.searchParams.get('view') as 'grid' | 'list') || 'list');
    let products = $state(data.products);
    let selectedProducts = $state<Client.Product| null>(null);
    let isProductDialogOpen = $state(false);
    let isCopyModalOpen = $state(false);
    let productToCopy = $state<Client.Product | null>(null);
    let selectedProductIds = $state<Set<string>>(new Set());
    let isBulkCopyModalOpen = $state(false);
    let isBulkDeleteModalOpen = $state(false);

    let categories = $derived.by(()=>{
        const uniqueCategories = ["all", ...new Set(products.map(p => p.category))];
        return uniqueCategories.map(category => ({
            value: category,
            label: category,
            disabled: false
        }))
    });
    
    
    let filteredProducts = $derived.by(() => {
        return products.filter((product) => {
            const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                product.description.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesCategory = categoryFilter === 'all' || product.category === categoryFilter;
            return matchesSearch && matchesCategory;
        });
    });

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'active': return 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400';
            case 'inactive': return 'bg-muted text-foreground-alt';
            case 'out_of_stock': return 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400';
            default: return 'bg-muted text-foreground-alt';
        }
    };
    
    const onEditProduct = (product: Client.Product) => {
        selectedProducts = product;
        isProductDialogOpen= true;
    }

    const onAddProduct = () => {
        isProductDialogOpen= true;
    }

    const onCopyProduct = (product: Client.Product) => {
        productToCopy = product;
        isCopyModalOpen = true;
    }

    const onCreateFromCopy = () => {
        if (productToCopy) {
            selectedProducts = {
                ...productToCopy,
                id: '',
                name: `${productToCopy.name} (Copy)`,
            };
            isCopyModalOpen = false;
            isProductDialogOpen = true;
        }
    }

    // Multi-select functions
    const toggleProductSelection = (productId: string) => {
        const newSet = new Set(selectedProductIds);
        if (newSet.has(productId)) {
            newSet.delete(productId);
        } else {
            newSet.add(productId);
        }
        selectedProductIds = newSet;
    };

    const toggleSelectAll = () => {
        if (selectedProductIds.size === filteredProducts.length) {
            selectedProductIds = new Set();
        } else {
            selectedProductIds = new Set(filteredProducts.map(p => p.id));
        }
    };

    const clearSelection = () => {
        selectedProductIds = new Set();
    };

    const onBulkCopy = () => {
        isBulkCopyModalOpen = true;
    };

    const onBulkDelete = () => {
        isBulkDeleteModalOpen = true;
    };

    const onConfirmBulkCopy = () => {
        // Create copies of selected products
        const selectedProducts = filteredProducts.filter(p => selectedProductIds.has(p.id));
        selectedProducts.forEach((product, index) => {
            const copyProduct = {
                ...product,
                id: '',
                name: `${product.name} (Copy ${index + 1})`,
            };
            // In a real app, you would send this to the server
            console.log('Creating copy of:', copyProduct);
        });

        isBulkCopyModalOpen = false;
        clearSelection();
        // Show success message or refresh products list
    };

    const onConfirmBulkDelete = () => {
        // Delete selected products
        const selectedIds = Array.from(selectedProductIds);
        console.log('Deleting products:', selectedIds);

        // In a real app, you would send this to the server
        // For now, just remove from local state
        products = products.filter(p => !selectedProductIds.has(p.id));

        isBulkDeleteModalOpen = false;
        clearSelection();
    };

    let isAllSelected = $derived(filteredProducts.length > 0 && selectedProductIds.size === filteredProducts.length);
    let isIndeterminate = $derived(selectedProductIds.size > 0 && selectedProductIds.size < filteredProducts.length);

    // Function to update URL with current state
    function updateURL() {
        const params = new URLSearchParams();

        if (searchTerm) params.set('search', searchTerm);
        if (categoryFilter !== 'all') params.set('category', categoryFilter);
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

    // Function to handle category filter change
    function handleCategoryChange(newCategory: string) {
        categoryFilter = newCategory;
        updateURL();
    }

    // React to URL changes (browser back/forward)
    $effect(() => {
        searchTerm = page.url.searchParams.get('search') || '';
        categoryFilter = page.url.searchParams.get('category') || 'all';
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
                    <h1 class="text-lg font-bold text-foreground">Products</h1>
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

                    <!-- Category Filter -->
                    <Select.Root
                            type="single"
                            onValueChange={(v) => (categoryFilter = v)}
                            items={categories}
                            allowDeselect={true}
                    >
                        <Select.Trigger
                                class="h-[34px] rounded-md border-border-input bg-background data-placeholder:text-foreground-alt/50 inline-flex w-[160px] touch-none select-none items-center border px-3 text-sm transition-colors"
                                aria-label="Select a Category"
                        >
                            <Funnel class="text-muted-foreground mr-2 size-4 flex-shrink-0" />
                            <span class="truncate whitespace-nowrap flex-1 min-w-0">
                                {categoryFilter === 'all' ? 'All Categories' : categoryFilter}
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
                                    {#each categories as { value, label, disabled } (value)}
                                        <Select.Item
                                                class="rounded-button data-highlighted:bg-muted outline-hidden data-disabled:opacity-50 flex h-10 w-full select-none items-center py-3 pl-5 pr-1.5 text-sm capitalize"
                                                {value} {label} {disabled}>
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
                        onclick={onAddProduct}
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
                            <h1 class="text-2xl font-bold text-foreground">Products</h1>
                            <StickyModeToggle size="sm" showLabel={false} />
                        </div>
                        <p class="text-foreground-alt">Manage your product catalog and inventory</p>
                    </div>
                </div>

                <!--  Header Filters  -->
                <ProductFilters
                    {searchTerm}
                    bind:categoryFilter={categoryFilter}
                    {viewMode}
                    {categories}
                    onSearchChange={handleSearchChange}
                    onCategoryChange={handleCategoryChange}
                    onViewModeChange={handleViewModeChange}
                    onAddProduct={onAddProduct}
                />
            </div>
        {/if}
    </div>

    <!-- Scrollable Products Display -->
    <div class="theme-transition transition-all duration-300 ease-in-out {stickyModeStore.isSticky ? 'px-4 py-2' : 'py-0'}">
        {#if viewMode === 'grid'}
            <div class="opacity-0 animate-[fadeIn_200ms_ease-in-out_forwards]">
                <ProductGrid
                    products={filteredProducts}
                    {getStatusColor}
                    {onEditProduct}
                    {onCopyProduct}
                />
            </div>
        {:else}
            <div class="opacity-0 animate-[fadeIn_200ms_ease-in-out_forwards]">
                <ProductTable
                    products={filteredProducts}
                    {selectedProductIds}
                    {isAllSelected}
                    {isIndeterminate}
                    {getStatusColor}
                    onToggleSelectAll={toggleSelectAll}
                    onToggleProductSelection={toggleProductSelection}
                    {onEditProduct}
                    {onCopyProduct}
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
    {#if filteredProducts.length === 0}
        <div class="text-center py-12">
            <Package class="mx-auto h-12 w-12 text-muted-foreground theme-transition" />
            <h3 class="mt-2 text-sm font-medium text-foreground">No products found</h3>
            <p class="mt-1 text-sm text-foreground-alt">
                {searchTerm || categoryFilter !== 'all'
                    ? 'Try adjusting your search or filter criteria'
                    : 'Get started by creating a new product'
                }
            </p>
        </div>
    {/if}

    <!-- Bulk Actions Toolbar -->
    {#if selectedProductIds.size > 0}
        <BulkActions
            selectedCount={selectedProductIds.size}
            onClearSelection={clearSelection}
            onBulkCopy={onBulkCopy}
            onBulkDelete={onBulkDelete}
        />
    {/if}
</div>

{#if isProductDialogOpen}
    <ProductForm bind:product={selectedProducts} formData={data.productForm} bind:isOpen={isProductDialogOpen} />
{/if}

<!-- Product Modals -->
<ProductModals
    {isCopyModalOpen}
    {isBulkCopyModalOpen}
    {isBulkDeleteModalOpen}
    {productToCopy}
    {selectedProductIds}
    onCloseCopyModal={() => isCopyModalOpen = false}
    onCloseBulkCopyModal={() => isBulkCopyModalOpen = false}
    onCloseBulkDeleteModal={() => isBulkDeleteModalOpen = false}
    {onCreateFromCopy}
    {onConfirmBulkCopy}
    {onConfirmBulkDelete}
/>
