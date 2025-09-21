<script lang="ts">
    import List from "phosphor-svelte/lib/List";
    import MagnifyingGlass from "phosphor-svelte/lib/MagnifyingGlass";
    import Plus from "phosphor-svelte/lib/Plus";
    import PencilLine from "phosphor-svelte/lib/PencilLine";
    import Trash from "phosphor-svelte/lib/Trash";
    import Package from "phosphor-svelte/lib/Package";
    import Bell from "phosphor-svelte/lib/Bell";
    import UserSquare  from "phosphor-svelte/lib/UserSquare";
    import GridFour from "phosphor-svelte/lib/GridFour";
    import Copy from "phosphor-svelte/lib/Copy";
    import ProductForm from "$lib/components/product-form.svelte";
    import Eye from "phosphor-svelte/lib/Eye";
    import Check from "phosphor-svelte/lib/Check";
    import X from "phosphor-svelte/lib/X";
    import { cubicOut } from 'svelte/easing';
    import { flip } from 'svelte/animate';
    import { send, receive } from '$lib/transition';
    import { fade, scale, slide } from 'svelte/transition';

    let { data, form } = $props();

    let searchTerm = $state('');
    let categoryFilter = $state('all');
    let viewMode = $state<'grid' | 'list'>('grid');
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
            case 'active': return 'bg-green-100 dark:bg-green-900/30 dark:bg-green-900/30 text-green-800 dark:text-green-400';
            case 'inactive': return 'bg-primary-100 dark:bg-secondary-800 text-primary-800 dark:text-secondary-200';
            case 'out_of_stock': return 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400';
            default: return 'bg-primary-100 dark:bg-secondary-800 text-primary-800 dark:text-secondary-200';
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
</script>

<!--<h1>Hellow</h1>-->
<!--<pre>-->
<!--    {JSON.stringify(data.activeUser, null, 2)}-->
<!--</pre>-->
<!--{JSON.stringify(form, null, 2)}-->
<div class="space-y-6">
    <!--  Header Actions  -->
    <div class="flex flex-col space-y-4 lg:flex-row lg:justify-between lg:items-center lg:space-y-0">
        <div class="flex flex-col space-y-4 sm:flex-row sm:items-center sm:space-y-0 sm:space-x-4">
            <div class="relative">
                <MagnifyingGlass class="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary-400 dark:text-primary-300 w-4 h-4" />
                <input
                        type="text"
                        placeholder="Search products..."
                        bind:value={searchTerm}
                        class="pl-10 pr-4 py-2 border border-primary-300 dark:border-primary-700 dark:bg-primary-900 dark:text-primary-50 dark:placeholder-primary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary-500 focus:border-transparent w-full sm:w-80"
                />
            </div>

            <select
                    bind:value={categoryFilter}
                    class="px-4 py-2 border border-primary-300 dark:border-primary-700 dark:bg-primary-900 dark:text-primary-50 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary-500 focus:border-transparent w-full sm:w-auto"
            >
                {#each categories as category (category)}
                    <option value={category}>
                        {category === 'all' ? 'All Categories' : category}
                    </option>
                {/each}
            </select>
        </div>

        <div class="flex items-center space-x-2">
            <!-- View Mode Toggle -->
            <div class="flex bg-primary-100 dark:bg-primary-800 rounded-lg p-1">
                <button
                    onclick={() => viewMode = 'grid'}
                    class={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                        viewMode === 'grid'
                            ? 'bg-primary-50 dark:bg-primary-700 text-primary-900 dark:text-primary-50 shadow-sm'
                            : 'text-primary-500 dark:text-primary-300 hover:text-primary-700 dark:hover:text-primary-100'
                    }`}
                >
                    <GridFour class="w-4 h-4" />
                </button>
                <button
                    onclick={() => viewMode = 'list'}
                    class={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                        viewMode === 'list'
                            ? 'bg-primary-50 dark:bg-primary-700 text-primary-900 dark:text-primary-50 shadow-sm'
                            : 'text-primary-500 dark:text-primary-300 hover:text-primary-700 dark:hover:text-primary-100'
                    }`}
                >
                    <List class="w-4 h-4" />
                </button>
            </div>

            <button
                    onclick={()=>{isProductDialogOpen= true;}}
                    class="bg-primary-900 hover:bg-primary-700 text-primary-100 px-4 py-2 rounded-lg flex items-center justify-center space-x-2 transition-colors w-full sm:w-auto"
            >
                <Plus class="w-4 h-4" />
                <span>Add Product</span>
            </button>
        </div>
    </div>

    <!-- Products Grid View -->
    {#if viewMode === 'grid'}
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6">
            {#each filteredProducts as product (product.id)}
                <div
                        in:receive={{ key: product.id }}
                        out:send={{ key: product.id }}
                        animate:flip={{ duration: 200 }}
                        class="bg-primary-50 dark:bg-primary-900 rounded-xl shadow-sm border border-primary-100 dark:border-primary-800 overflow-hidden hover:shadow-md transition-shadow">
                    <div class="aspect-square bg-primary-100 dark:bg-primary-700 overflow-hidden">
                        <img
                                src={product.imagePath}
                                alt={product.name}
                                class="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                        />
                    </div>

                    <div class="p-4">
                        <div class="flex items-start justify-between mb-2">
                            <h3 class="font-semibold text-primary-900 dark:text-primary-50 text-sm line-clamp-2">{product.name}</h3>
                            <span class={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(product.status)}`}>
                      {product.status.replace('_', ' ')}
                    </span>
                        </div>

                        <p class="text-primary-600 dark:text-primary-200 text-xs mb-3 line-clamp-2">{product.description}</p>

                        <div class="flex items-center justify-between mb-3">
                            <span class="text-lg font-bold text-primary-900 dark:text-primary-50">${product.price}</span>
                            <span class="text-sm text-primary-500 dark:text-primary-200">Stock: {product.stock}</span>
                        </div>

                        <div class="flex items-center space-x-1">
                            <a
                                    href="/products/{product.id}"
                                    class="flex-1 bg-primary-50 dark:bg-primary-700 hover:bg-primary-100 dark:hover:bg-primary-600 text-primary-600 dark:text-primary-200 px-2 py-2 rounded-lg text-xs font-medium transition-colors flex items-center justify-center space-x-1"
                            >
                                <Eye class="w-3 h-3" />
                                <span>View</span>
                            </a>
                            <button
                                    onclick={() => onEditProduct(product)}
                                    class="flex-1 bg-secondary-50 dark:bg-secondary-900/30 hover:bg-secondary-100 dark:hover:bg-secondary-900/50 text-secondary-600 dark:text-secondary-400 px-2 py-2 rounded-lg text-xs font-medium transition-colors flex items-center justify-center space-x-1"
                            >
                                <PencilLine class="w-3 h-3" />
                                <span>Edit</span>
                            </button>
                            <button
                                    onclick={() => onCopyProduct(product)}
                                    class="flex-1 bg-green-50 dark:bg-green-900/30 hover:bg-green-100 dark:hover:bg-green-900/50 text-green-600 dark:text-green-400 px-2 py-2 rounded-lg text-xs font-medium transition-colors flex items-center justify-center space-x-1"
                            >
                                <Copy class="w-3 h-3" />
                                <span>Copy</span>
                            </button>
                            <button class="flex-1 bg-red-50 dark:bg-red-900/30 hover:bg-red-100 dark:hover:bg-red-900/50 text-red-600 dark:text-red-400 px-2 py-2 rounded-lg text-xs font-medium transition-colors flex items-center justify-center space-x-1">
                                <Trash class="w-3 h-3" />
                                <span>Delete</span>
                            </button>
                        </div>
                    </div>
                </div>
            {/each}
        </div>
    {/if}

    <!-- Bulk Actions Toolbar -->
    {#if viewMode === 'list' && selectedProductIds.size > 0}
        <div
            class="bg-secondary-50 dark:bg-secondary-900/30 border border-secondary-200 dark:border-secondary-800 rounded-lg p-4 mb-4"
            transition:slide={{
                duration: 200,
                easing: cubicOut
            }}
        >
            <div class="flex items-center justify-between">
                <div class="flex items-center space-x-3">
                    <span class="text-sm font-medium text-secondary-900 dark:text-secondary-100">
                        {selectedProductIds.size} product{selectedProductIds.size === 1 ? '' : 's'} selected
                    </span>
                    <button
                        onclick={clearSelection}
                        class="text-sm text-secondary-600 dark:text-secondary-400 hover:text-secondary-800 dark:hover:secondary-secondary-200 underline"
                    >
                        Clear selection
                    </button>
                </div>
                <div class="flex items-center space-x-2">
                    <button
                        onclick={onBulkCopy}
                        class="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-green-700 dark:text-green-400 bg-green-100 dark:bg-green-900/30 hover:bg-green-200 dark:hover:bg-green-900/50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                    >
                        <Copy class="w-4 h-4 mr-2" />
                        Copy Selected
                    </button>
                    <button
                        onclick={onBulkDelete}
                        class="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-red-700 dark:text-red-400 bg-red-100 dark:bg-red-900/30 hover:bg-red-200 dark:hover:bg-red-900/50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    >
                        <Trash class="w-4 h-4 mr-2" />
                        Delete Selected
                    </button>
                </div>
            </div>
        </div>
    {/if}

    <!-- Products List View -->
    {#if viewMode === 'list'}
        <div class="bg-primary-50 dark:bg-primary-900 rounded-xl shadow-sm border border-primary-100 dark:border-primary-800 overflow-hidden">
            <div class="overflow-x-auto">
                <table class="w-full">
                    <thead class="bg-primary-100 dark:bg-primary-800">
                    <tr>
                        <th class="px-3 sm:px-6 py-3 text-left">
                            <label class="flex items-center">
                                <input
                                    type="checkbox"
                                    checked={isAllSelected}
                                    indeterminate={isIndeterminate}
                                    onchange={toggleSelectAll}
                                    class="h-4 w-4 text-secondary-600 focus:ring-secondary-500 border-primary-300 dark:border-primary-600 rounded"
                                />
                                <span class="sr-only">Select all products</span>
                            </label>
                        </th>
                        <th class="px-3 sm:px-6 py-3 text-left text-xs font-medium text-primary-500 dark:text-primary-200 uppercase tracking-wider">
                            Product
                        </th>
                        <th class="px-3 sm:px-6 py-3 text-left text-xs font-medium text-primary-500 dark:text-primary-200 uppercase tracking-wider hidden sm:table-cell">
                            Category
                        </th>
                        <th class="px-3 sm:px-6 py-3 text-left text-xs font-medium text-primary-500 dark:text-primary-200 uppercase tracking-wider">
                            Price
                        </th>
                        <th class="px-3 sm:px-6 py-3 text-left text-xs font-medium text-primary-500 dark:text-primary-200 uppercase tracking-wider">
                            Stock
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
                    {#each filteredProducts as product (product.id)}
                        <tr class="hover:bg-primary-50 dark:hover:bg-primary-800 {selectedProductIds.has(product.id) ? 'bg-secondary-50 dark:bg-secondary-900/30' : ''}"
                            in:receive={{ key: product.id }}
                            out:send={{ key: product.id }}
                            animate:flip={{ duration: 200 }}>
                            <td class="px-3 sm:px-6 py-4">
                                <label class="flex items-center">
                                    <input
                                        type="checkbox"
                                        checked={selectedProductIds.has(product.id)}
                                        onchange={() => toggleProductSelection(product.id)}
                                        class="h-4 w-4 text-secondary-600 focus:ring-secondary-500 border-primary-300 dark:border-primary-600 rounded"
                                    />
                                    <span class="sr-only">Select {product.name}</span>
                                </label>
                            </td>
                            <td class="px-3 sm:px-6 py-4">
                                <div class="flex items-center">
                                    <div class="flex-shrink-0 h-12 w-12">
                                        <img class="h-12 w-12 rounded-lg object-cover" src={product.imagePath} alt={product.name} />
                                    </div>
                                    <div class="ml-4">
                                        <div class="text-sm font-medium text-primary-900 dark:text-primary-50 line-clamp-2">{product.name}</div>
                                        <div class="text-sm text-primary-500 dark:text-primary-200 hidden sm:block line-clamp-1">{product.description}</div>
                                    </div>
                                </div>
                            </td>
                            <td class="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-primary-900 dark:text-primary-50 hidden sm:table-cell">
                                {product.category}
                            </td>
                            <td class="px-3 sm:px-6 py-4 whitespace-nowrap text-sm font-semibold text-primary-900 dark:text-primary-50">
                                ${product.price}
                            </td>
                            <td class="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-primary-900 dark:text-primary-50">
                                {product.stock}
                            </td>
                            <td class="px-3 sm:px-6 py-4 whitespace-nowrap">
                                <span class={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(product.status)}`}>
                                    {product.status.replace('_', ' ')}
                                </span>
                            </td>
                            <td class="px-3 sm:px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                <div class="flex items-center space-x-2">
                                    <a
                                            href="/products/{product.id}"
                                            class="text-primary-600 dark:text-primary-300 hover:text-primary-900 dark:hover:text-primary-50 transition-colors p-1 hover:bg-primary-50 dark:hover:bg-primary-700 rounded"
                                            title="View Product"
                                    >
                                        <Eye class="w-4 h-4" />
                                    </a>
                                    <button
                                            onclick={() => onEditProduct(product)}
                                            class="text-secondary-600 dark:text-secondary-400 hover:text-secondary-900 dark:hover:text-secondary-200 transition-colors p-1 hover:bg-secondary-50 dark:hover:bg-secondary-900/30 rounded"
                                            title="Edit Product"
                                    >
                                        <PencilLine class="w-4 h-4" />
                                    </button>
                                    <button
                                            onclick={() => onCopyProduct(product)}
                                            class="text-green-600 dark:text-green-400 hover:text-green-900 dark:hover:text-green-200 transition-colors p-1 hover:bg-green-50 dark:hover:bg-green-900/30 rounded"
                                            title="Copy Product"
                                    >
                                        <Copy class="w-4 h-4" />
                                    </button>
                                    <button
                                            class="text-red-600 dark:text-red-400 hover:text-red-900 transition-colors p-1 hover:bg-red-50 rounded"
                                            title="Delete Product"
                                    >
                                        <Trash class="w-4 h-4" />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    {/each}
                    </tbody>
                </table>
            </div>
        </div>
    {/if}

    {#if filteredProducts.length === 0}
        <div class="text-center py-12">
            <Package class="mx-auto h-12 w-12 text-primary-400" />
            <h3 class="mt-2 text-sm font-medium text-primary-900 dark:text-white">No products found</h3>
            <p class="mt-1 text-sm text-primary-500 dark:text-primary-400">
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

<!-- Copy Product Modal -->
{#if isCopyModalOpen && productToCopy}
    <div class="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
        <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <!-- svelte-ignore a11y_click_events_have_key_events -->
            <!-- svelte-ignore a11y_no_static_element_interactions -->
            <div
                class="fixed inset-0 bg-black/40 transition-opacity"
                onclick={() => isCopyModalOpen = false}
                role="button"
                tabindex="-1"
                aria-label="Close modal"
            ></div>

            <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

            <div class="relative inline-block align-bottom bg-primary-50 dark:bg-primary-900 rounded-lg shadow-xl px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
                <div>
                    <div class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 dark:bg-green-900/30 dark:bg-green-900/30">
                        <Copy class="h-6 w-6 text-green-600 dark:text-green-400 dark:text-green-400" />
                    </div>
                    <div class="mt-3 text-center sm:mt-5">
                        <h3 class="text-lg leading-6 font-medium text-primary-900 dark:text-white dark:text-white" id="modal-title">
                            Copy Product
                        </h3>
                        <div class="mt-2">
                            <p class="text-sm text-primary-500 dark:text-primary-200">
                                Are you sure you want to copy "{productToCopy.name}"? This will create a new product with the same details that you can modify.
                            </p>
                        </div>

                        <!-- Product Preview -->
                        <div class="mt-4 p-4 bg-primary-50 dark:bg-primary-700 rounded-lg">
                            <div class="flex items-center space-x-3">
                                <img src={productToCopy.imagePath} alt={productToCopy.name} class="w-12 h-12 rounded-lg object-cover" />
                                <div class="text-left">
                                    <p class="text-sm font-medium text-primary-900 dark:text-white">{productToCopy.name}</p>
                                    <p class="text-sm text-primary-500 dark:text-primary-200">{productToCopy.category} • ${productToCopy.price}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
                    <button
                            type="button"
                            onclick={onCreateFromCopy}
                            class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:col-start-2 sm:text-sm"
                    >
                        Create Copy
                    </button>
                    <button
                            type="button"
                            onclick={() => isCopyModalOpen = false}
                            class="mt-3 w-full inline-flex justify-center rounded-md border border-primary-300 dark:border-primary-700 shadow-sm px-4 py-2 bg-primary-50 dark:bg-primary-700 text-base font-medium text-primary-700 dark:text-primary-200 hover:bg-primary-50 dark:hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:col-start-1 sm:text-sm"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    </div>
{/if}

<!-- Bulk Copy Modal -->
{#if isBulkCopyModalOpen}
    <div
        class="fixed inset-0 z-50 overflow-y-auto"
        aria-labelledby="modal-title"
        role="dialog"
        aria-modal="true"
        transition:fade={{ duration: 200 }}
    >
        <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <!-- svelte-ignore a11y_click_events_have_key_events -->
            <!-- svelte-ignore a11y_no_static_element_interactions -->
            <div
                class="fixed inset-0 bg-black/20"
                onclick={() => isBulkCopyModalOpen = false}
                role="button"
                tabindex="-1"
                aria-label="Close modal"
            ></div>

            <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

            <div
                class="relative inline-block align-bottom bg-primary-50 dark:bg-primary-900 rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6"
                transition:scale={{
                    duration: 300,
                    start: 0.9,
                    easing: cubicOut
                }}
            >
                <div>
                    <div class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 dark:bg-green-900/30">
                        <Copy class="h-6 w-6 text-green-600 dark:text-green-400" />
                    </div>
                    <div class="mt-3 text-center sm:mt-5">
                        <h3 class="text-lg leading-6 font-medium text-primary-900 dark:text-primary-50" id="modal-title">
                            Copy Products
                        </h3>
                        <div class="mt-2">
                            <p class="text-sm text-primary-500 dark:text-primary-200">
                                Are you sure you want to copy {selectedProductIds.size} selected product{selectedProductIds.size === 1 ? '' : 's'}? This will create new products with the same details that you can modify.
                            </p>
                        </div>
                    </div>
                </div>
                <div class="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
                    <button
                            type="button"
                            onclick={onConfirmBulkCopy}
                            class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:col-start-2 sm:text-sm"
                    >
                        Create Copies
                    </button>
                    <button
                            type="button"
                            onclick={() => isBulkCopyModalOpen = false}
                            class="mt-3 w-full inline-flex justify-center rounded-md border border-primary-300 dark:border-primary-700 shadow-sm px-4 py-2 bg-primary-50 dark:bg-primary-700 text-base font-medium text-primary-700 dark:text-primary-200 hover:bg-primary-50 dark:hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:col-start-1 sm:text-sm"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    </div>
{/if}

<!-- Bulk Delete Modal -->
{#if isBulkDeleteModalOpen}
    <div
        class="fixed inset-0 z-50 overflow-y-auto"
        aria-labelledby="modal-title"
        role="dialog"
        aria-modal="true"
        transition:fade={{ duration: 200 }}
    >
        <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <!-- svelte-ignore a11y_click_events_have_key_events -->
            <!-- svelte-ignore a11y_no_static_element_interactions -->
            <div
                class="fixed inset-0 bg-black/20"
                onclick={() => isBulkDeleteModalOpen = false}
                role="button"
                tabindex="-1"
                aria-label="Close modal"
            ></div>

            <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

            <div
                class="relative inline-block align-bottom bg-primary-50 dark:bg-primary-900 rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6"
                transition:scale={{
                    duration: 300,
                    start: 0.9,
                    easing: cubicOut
                }}
            >
                <div>
                    <div class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 dark:bg-red-900/30">
                        <Trash class="h-6 w-6 text-red-600 dark:text-red-400" />
                    </div>
                    <div class="mt-3 text-center sm:mt-5">
                        <h3 class="text-lg leading-6 font-medium text-primary-900 dark:text-primary-50" id="modal-title">
                            Delete Products
                        </h3>
                        <div class="mt-2">
                            <p class="text-sm text-primary-500 dark:text-primary-200">
                                Are you sure you want to delete {selectedProductIds.size} selected product{selectedProductIds.size === 1 ? '' : 's'}? This action cannot be undone.
                            </p>
                        </div>
                    </div>
                </div>
                <div class="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
                    <button
                            type="button"
                            onclick={onConfirmBulkDelete}
                            class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:col-start-2 sm:text-sm"
                    >
                        Delete Products
                    </button>
                    <button
                            type="button"
                            onclick={() => isBulkDeleteModalOpen = false}
                            class="mt-3 w-full inline-flex justify-center rounded-md border border-primary-300 dark:border-primary-700 shadow-sm px-4 py-2 bg-primary-50 dark:bg-primary-700 text-base font-medium text-primary-700 dark:text-primary-200 hover:bg-primary-50 dark:hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:col-start-1 sm:text-sm"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    </div>
{/if}
