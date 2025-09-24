<script lang="ts">
    import Eye from "phosphor-svelte/lib/Eye";
    import PencilLine from "phosphor-svelte/lib/PencilLine";
    import Copy from "phosphor-svelte/lib/Copy";
    import Trash from "phosphor-svelte/lib/Trash";
    import { flip } from 'svelte/animate';
    import { send, receive } from '$lib/transition';

    interface Props {
        products: Client.Product[];
        getStatusColor: (status: string) => string;
        onEditProduct: (product: Client.Product) => void;
        onCopyProduct: (product: Client.Product) => void;
    }

    let {
        products,
        getStatusColor,
        onEditProduct,
        onCopyProduct
    }: Props = $props();
</script>

<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6">
    {#each products as product (product.id)}
        <div
            in:receive={{ key: product.id }}
            out:send={{ key: product.id }}
            animate:flip={{ duration: 200 }}
            class="bg-background-alt rounded-xl shadow-sm border border-border-card overflow-hidden hover:shadow-md theme-transition">
            <div class="aspect-square bg-muted overflow-hidden theme-transition">
                <img
                    src={product.imagePath}
                    alt={product.name}
                    class="w-full h-full object-cover hover:scale-105 theme-transition"
                />
            </div>

            <div class="p-4 theme-transition">
                <div class="flex items-start justify-between mb-2">
                    <h3 class="font-semibold text-foreground text-sm line-clamp-2">{product.name}</h3>
                    <span class={`px-2 py-1 text-xs font-medium rounded-full theme-transition ${getStatusColor(product.status)}`}>
                        {product.status.replace('_', ' ')}
                    </span>
                </div>

                <p class="text-foreground-alt text-xs mb-3 line-clamp-2">{product.description}</p>

                <div class="flex items-center justify-between mb-3">
                    <span class="text-lg font-bold text-foreground">${product.price}</span>
                    <span class="text-sm text-foreground-alt">Stock: {product.stock}</span>
                </div>

                <div class="flex items-center space-x-1">
                    <a
                        href="/products/{product.id}"
                        class="flex-1 bg-muted hover:bg-muted/80 text-foreground px-2 py-2 rounded-lg text-xs font-medium theme-transition-fast flex items-center justify-center space-x-1"
                    >
                        <Eye class="w-3 h-3 theme-transition" />
                        <span>View</span>
                    </a>
                    <button
                        onclick={() => onEditProduct(product)}
                        class="flex-1 bg-blue-50 dark:bg-blue-900/30 hover:bg-blue-100 dark:hover:bg-blue-900/50 text-blue-600 dark:text-blue-400 px-2 py-2 rounded-lg text-xs font-medium theme-transition-fast flex items-center justify-center space-x-1"
                    >
                        <PencilLine class="w-3 h-3 theme-transition" />
                        <span>Edit</span>
                    </button>
                    <button
                        onclick={() => onCopyProduct(product)}
                        class="flex-1 bg-green-50 dark:bg-green-900/30 hover:bg-green-100 dark:hover:bg-green-900/50 text-green-600 dark:text-green-400 px-2 py-2 rounded-lg text-xs font-medium theme-transition-fast flex items-center justify-center space-x-1"
                    >
                        <Copy class="w-3 h-3 theme-transition" />
                        <span>Copy</span>
                    </button>
                    <button class="flex-1 bg-red-50 dark:bg-red-900/30 hover:bg-red-100 dark:hover:bg-red-900/50 text-red-600 dark:text-red-400 px-2 py-2 rounded-lg text-xs font-medium theme-transition-fast flex items-center justify-center space-x-1">
                        <Trash class="w-3 h-3 theme-transition" />
                        <span>Delete</span>
                    </button>
                </div>
            </div>
        </div>
    {/each}
</div>