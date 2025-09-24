<script lang="ts">
    import Copy from "phosphor-svelte/lib/Copy";
    import Trash from "phosphor-svelte/lib/Trash";
    import { fade, scale } from 'svelte/transition';
    import { cubicOut } from 'svelte/easing';

    interface Props {
        isCopyModalOpen: boolean;
        isBulkCopyModalOpen: boolean;
        isBulkDeleteModalOpen: boolean;
        productToCopy: Client.Product | null;
        selectedProductIds: Set<string>;
        onCloseCopyModal: () => void;
        onCloseBulkCopyModal: () => void;
        onCloseBulkDeleteModal: () => void;
        onCreateFromCopy: () => void;
        onConfirmBulkCopy: () => void;
        onConfirmBulkDelete: () => void;
    }

    let {
        isCopyModalOpen,
        isBulkCopyModalOpen,
        isBulkDeleteModalOpen,
        productToCopy,
        selectedProductIds,
        onCloseCopyModal,
        onCloseBulkCopyModal,
        onCloseBulkDeleteModal,
        onCreateFromCopy,
        onConfirmBulkCopy,
        onConfirmBulkDelete
    }: Props = $props();
</script>

<!-- Copy Product Modal -->
{#if isCopyModalOpen && productToCopy}
    <div class="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
        <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <!-- svelte-ignore a11y_click_events_have_key_events -->
            <!-- svelte-ignore a11y_no_static_element_interactions -->
            <div
                class="fixed inset-0 bg-black/40 theme-transition"
                onclick={onCloseCopyModal}
                role="button"
                tabindex="-1"
                aria-label="Close modal"
            ></div>

            <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

            <div class="relative inline-block align-bottom bg-background-alt rounded-lg shadow-xl px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform theme-transition sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
                <div>
                    <div class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 dark:bg-green-900/30">
                        <Copy class="h-6 w-6 text-green-600 dark:text-green-400 theme-transition" />
                    </div>
                    <div class="mt-3 text-center sm:mt-5">
                        <h3 class="text-lg leading-6 font-medium text-foreground" id="modal-title">
                            Copy Product
                        </h3>
                        <div class="mt-2">
                            <p class="text-sm text-foreground-alt">
                                Are you sure you want to copy "{productToCopy.name}"? This will create a new product with the same details that you can modify.
                            </p>
                        </div>

                        <!-- Product Preview -->
                        <div class="mt-4 p-4 bg-muted rounded-lg">
                            <div class="flex items-center space-x-3">
                                <img src={productToCopy.imagePath} alt={productToCopy.name} class="w-12 h-12 rounded-lg object-cover" />
                                <div class="text-left">
                                    <p class="text-sm font-medium text-foreground">{productToCopy.name}</p>
                                    <p class="text-sm text-foreground-alt">{productToCopy.category} • ${productToCopy.price}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
                    <button
                        type="button"
                        onclick={onCreateFromCopy}
                        class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:col-start-2 sm:text-sm theme-transition-fast"
                    >
                        Create Copy
                    </button>
                    <button
                        type="button"
                        onclick={onCloseCopyModal}
                        class="mt-3 w-full inline-flex justify-center rounded-md border border-border-input shadow-sm px-4 py-2 bg-background-alt text-base font-medium text-foreground hover:bg-muted focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent sm:mt-0 sm:col-start-1 sm:text-sm theme-transition-fast"
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
                class="fixed inset-0 bg-black/20 theme-transition"
                onclick={onCloseBulkCopyModal}
                role="button"
                tabindex="-1"
                aria-label="Close modal"
            ></div>

            <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

            <div
                class="relative inline-block align-bottom bg-background-alt rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform theme-transition sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6"
                transition:scale={{
                    duration: 300,
                    start: 0.9,
                    easing: cubicOut
                }}
            >
                <div>
                    <div class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 dark:bg-green-900/30">
                        <Copy class="h-6 w-6 text-green-600 dark:text-green-400 theme-transition" />
                    </div>
                    <div class="mt-3 text-center sm:mt-5">
                        <h3 class="text-lg leading-6 font-medium text-foreground" id="modal-title">
                            Copy Products
                        </h3>
                        <div class="mt-2">
                            <p class="text-sm text-foreground-alt">
                                Are you sure you want to copy {selectedProductIds.size} selected product{selectedProductIds.size === 1 ? '' : 's'}? This will create new products with the same details that you can modify.
                            </p>
                        </div>
                    </div>
                </div>
                <div class="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
                    <button
                        type="button"
                        onclick={onConfirmBulkCopy}
                        class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:col-start-2 sm:text-sm theme-transition-fast"
                    >
                        Create Copies
                    </button>
                    <button
                        type="button"
                        onclick={onCloseBulkCopyModal}
                        class="mt-3 w-full inline-flex justify-center rounded-md border border-border-input shadow-sm px-4 py-2 bg-background-alt text-base font-medium text-foreground hover:bg-muted focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent sm:mt-0 sm:col-start-1 sm:text-sm theme-transition-fast"
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
                class="fixed inset-0 bg-black/20 theme-transition"
                onclick={onCloseBulkDeleteModal}
                role="button"
                tabindex="-1"
                aria-label="Close modal"
            ></div>

            <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

            <div
                class="relative inline-block align-bottom bg-background-alt rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform theme-transition sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6"
                transition:scale={{
                    duration: 300,
                    start: 0.9,
                    easing: cubicOut
                }}
            >
                <div>
                    <div class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 dark:bg-red-900/30">
                        <Trash class="h-6 w-6 text-red-600 dark:text-red-400 theme-transition" />
                    </div>
                    <div class="mt-3 text-center sm:mt-5">
                        <h3 class="text-lg leading-6 font-medium text-foreground" id="modal-title">
                            Delete Products
                        </h3>
                        <div class="mt-2">
                            <p class="text-sm text-foreground-alt">
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
                        onclick={onCloseBulkDeleteModal}
                        class="mt-3 w-full inline-flex justify-center rounded-md border border-border-input shadow-sm px-4 py-2 bg-background-alt text-base font-medium text-foreground hover:bg-muted focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent sm:mt-0 sm:col-start-1 sm:text-sm theme-transition-fast"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    </div>
{/if}