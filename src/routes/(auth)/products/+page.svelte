<script lang="ts">
    import ProductForm from "$lib/components/product-form.svelte";
    import ProductFilters from "$lib/components/products/ProductFilters.svelte";
    import ProductGrid from "$lib/components/products/ProductGrid.svelte";
    import ProductTable from "$lib/components/products/ProductTable.svelte";
    import BulkActions from "$lib/components/products/BulkActions.svelte";
    import ProductModals from "$lib/components/products/ProductModals.svelte";
    import Package from "phosphor-svelte/lib/Package";
    import { page } from '$app/state';
    import { goto } from '$app/navigation';

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
    
    let categories = $derived(['all', ...Array.from(new Set(products.map(p => p.category)))]);
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

<div class="space-y-6 theme-transition">
    <!--  Header Actions  -->
    <ProductFilters
        {searchTerm}
        {categoryFilter}
        {viewMode}
        {categories}
        onSearchChange={handleSearchChange}
        onCategoryChange={handleCategoryChange}
        onViewModeChange={handleViewModeChange}
        onAddProduct={onAddProduct}
    />

    <!-- Products Display -->
    <div class="theme-transition transition-all duration-300 ease-in-out">
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

    <!-- Bulk Actions Toolbar -->
    {#if selectedProductIds.size > 0}
        <BulkActions
            selectedCount={selectedProductIds.size}
            onClearSelection={clearSelection}
            onBulkCopy={onBulkCopy}
            onBulkDelete={onBulkDelete}
        />
    {/if}


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
