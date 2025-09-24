<script lang="ts">
    import Eye from "phosphor-svelte/lib/Eye";
    import PencilLine from "phosphor-svelte/lib/PencilLine";
    import Copy from "phosphor-svelte/lib/Copy";
    import Trash from "phosphor-svelte/lib/Trash";
    import { flip } from 'svelte/animate';
    import { send, receive } from '$lib/transition';

    interface Props {
        products: Client.Product[];
        selectedProductIds: Set<string>;
        isAllSelected: boolean;
        isIndeterminate: boolean;
        getStatusColor: (status: string) => string;
        onToggleSelectAll: () => void;
        onToggleProductSelection: (productId: string) => void;
        onEditProduct: (product: Client.Product) => void;
        onCopyProduct: (product: Client.Product) => void;
    }

    let {
        products,
        selectedProductIds,
        isAllSelected,
        isIndeterminate,
        getStatusColor,
        onToggleSelectAll,
        onToggleProductSelection,
        onEditProduct,
        onCopyProduct
    }: Props = $props();
</script>

<div class="bg-background-alt rounded-xl shadow-sm border border-border-card overflow-hidden theme-transition">
    <div class="overflow-x-auto">
        <table class="w-full theme-transition">
            <thead class="bg-muted theme-transition">
            <tr>
                <th class="px-3 sm:px-6 py-3 text-left">
                    <label class="flex items-center">
                        <input
                            type="checkbox"
                            checked={isAllSelected}
                            indeterminate={isIndeterminate}
                            onchange={onToggleSelectAll}
                            class="h-4 w-4 text-accent focus:ring-accent border-border-input rounded theme-transition"
                        />
                        <span class="sr-only">Select all products</span>
                    </label>
                </th>
                <th class="px-3 sm:px-6 py-3 text-left text-xs font-medium text-foreground-alt uppercase tracking-wider">
                    Product
                </th>
                <th class="px-3 sm:px-6 py-3 text-left text-xs font-medium text-foreground-alt uppercase tracking-wider hidden sm:table-cell">
                    Category
                </th>
                <th class="px-3 sm:px-6 py-3 text-left text-xs font-medium text-foreground-alt uppercase tracking-wider">
                    Price
                </th>
                <th class="px-3 sm:px-6 py-3 text-left text-xs font-medium text-foreground-alt uppercase tracking-wider">
                    Stock
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
            {#each products as product (product.id)}
                <tr class="hover:bg-muted theme-transition-fast {selectedProductIds.has(product.id) ? 'bg-blue-50 dark:bg-blue-900/30' : ''}"
                    in:receive={{ key: product.id }}
                    out:send={{ key: product.id }}
                    animate:flip={{ duration: 200 }}>
                    <td class="px-3 sm:px-6 py-4">
                        <label class="flex items-center">
                            <input
                                type="checkbox"
                                checked={selectedProductIds.has(product.id)}
                                onchange={() => onToggleProductSelection(product.id)}
                                class="h-4 w-4 text-accent focus:ring-accent border-border-input rounded theme-transition"
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
                                <div class="text-sm font-medium text-foreground line-clamp-2">{product.name}</div>
                                <div class="text-sm text-foreground-alt hidden sm:block line-clamp-1">{product.description}</div>
                            </div>
                        </div>
                    </td>
                    <td class="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-foreground hidden sm:table-cell">
                        {product.category}
                    </td>
                    <td class="px-3 sm:px-6 py-4 whitespace-nowrap text-sm font-semibold text-foreground">
                        ${product.price}
                    </td>
                    <td class="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-foreground">
                        {product.stock}
                    </td>
                    <td class="px-3 sm:px-6 py-4 whitespace-nowrap">
                        <span class={`px-2 py-1 text-xs font-medium rounded-full theme-transition ${getStatusColor(product.status)}`}>
                            {product.status.replace('_', ' ')}
                        </span>
                    </td>
                    <td class="px-3 sm:px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                        <div class="flex items-center space-x-2">
                            <a
                                href="/products/{product.id}"
                                class="text-foreground hover:text-foreground/80 theme-transition-fast p-1 hover:bg-muted rounded"
                                title="View Product"
                            >
                                <Eye class="w-4 h-4 theme-transition" />
                            </a>
                            <button
                                onclick={() => onEditProduct(product)}
                                class="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-200 theme-transition-fast p-1 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded"
                                title="Edit Product"
                            >
                                <PencilLine class="w-4 h-4 theme-transition" />
                            </button>
                            <button
                                onclick={() => onCopyProduct(product)}
                                class="text-green-600 dark:text-green-400 hover:text-green-900 dark:hover:text-green-200 theme-transition-fast p-1 hover:bg-green-50 dark:hover:bg-green-900/30 rounded"
                                title="Copy Product"
                            >
                                <Copy class="w-4 h-4 theme-transition" />
                            </button>
                            <button
                                class="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-200 theme-transition-fast p-1 hover:bg-red-50 dark:hover:bg-red-900/30 rounded"
                                title="Delete Product"
                            >
                                <Trash class="w-4 h-4 theme-transition" />
                            </button>
                        </div>
                    </td>
                </tr>
            {/each}
            </tbody>
        </table>
    </div>
</div>