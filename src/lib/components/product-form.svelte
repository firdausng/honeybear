<script lang="ts">
    import {Dialog, Button} from "bits-ui";
    import X from "phosphor-svelte/lib/X";
    import PencilLine from "phosphor-svelte/lib/PencilLine";
    import FloppyDisk from "phosphor-svelte/lib/FloppyDisk";
    import SuperDebug, {type Infer, superForm, type SuperValidated} from "sveltekit-superforms";
    import {type ProductSchema} from "$lib/schema";
    import ProductFormFields from "$lib/components/forms/ProductFormFields.svelte";

    interface Props {
        formData: SuperValidated<Infer<ProductSchema>>;
        product?: Client.Product | null;
        isOpen?: boolean;
        onClose?: () => void;
        isModal?: boolean;
        title?: string;
    }

    let {
        formData,
        product = $bindable(),
        isOpen = $bindable(),
        onClose,
        isModal = true,
        title = "Edit Products"
    }: Props = $props();

    const {form, errors, constraints, enhance, reset, message, allErrors} = superForm(formData, {
        resetForm: false,
        taintedMessage: null,
        invalidateAll: false,
        onUpdate: ({ form }) => {
            if (form.valid) {
                if (isModal) {
                    setOpen(false);
                }
            }
        }
    });

    function getOpen() {
        return isOpen || false;
    }

    function setOpen(newOpen: boolean) {
        if (!newOpen) {
            product = null;
            if (onClose) onClose();
        }
        if (isOpen !== undefined) {
            isOpen = newOpen;
        }
    }

    if (product !== null && product !== undefined) {
        reset({
            data: {
                name: product.name,
                sku: product.sku,
                price: `${product.price}`,
                description: product.description,
                stock: product.stock,
                category: product.category,
                image: product.imagePath,
                status: product.status,
                featured: product.isFeatured
            }
        });
    }

    // Shared form content component
    function FormContent() {
        return {
            fields: ProductFormFields,
            props: { form, errors, constraints }
        };
    }

    // Shared form messages component
    function FormMessages() {
        return { message, allErrors };
    }
</script>

{#if isModal}
    <button
        class="flex-1 bg-background-alt hover:bg-accent text-accent-foreground px-3 py-2 rounded-lg text-xs font-medium theme-transition-fast flex items-center justify-center space-x-1"
        onclick={() => {setOpen(true)}}>
        <PencilLine class="w-4 h-4 theme-transition"/>
        <span>Edit</span>
    </button>

    <Dialog.Root bind:open={getOpen, setOpen}>
        <Dialog.Portal>
            <Dialog.Overlay
                class="data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/20 theme-transition"
            />
            <Dialog.Content
                class="rounded-xl bg-background shadow-popover data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 outline-hidden fixed left-[50%] top-[50%] z-50 w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] border border-border-card shadow-lg p-0 md:w-full max-h-[90vh] flex flex-col theme-transition"
            >
                <!-- Fixed Header -->
                <div class="flex-shrink-0 p-5 theme-transition">
                    <SuperDebug data={$form}/>
                    <Dialog.Title
                        class="flex w-full items-center justify-between text-lg font-semibold tracking-tight"
                    >
                        <div></div>
                        <div>
                            <h2 class="text-xl font-semibold text-gray-900 dark:text-white">{title}</h2>
                        </div>
                        <Button.Root
                            type="button"
                            class="flex items-center justify-center w-8 h-8 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent theme-transition-fast"
                            onclick={() => setOpen(false)}
                        >
                            <X class="w-5 h-5 theme-transition"/>
                        </Button.Root>
                    </Dialog.Title>

                    <!-- Form-level messages -->
                    {#if $message}
                        <div class="mt-4 p-3 rounded-lg theme-transition {$message.includes('successfully') ? 'bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800' : 'bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800'}">
                            <p class="text-sm {$message.includes('successfully') ? 'text-green-800 dark:text-green-400' : 'text-red-800 dark:text-red-400'} flex items-center space-x-2">
                                {#if $message.includes('successfully')}
                                    <span class="text-green-500">✓</span>
                                {:else}
                                    <span class="text-red-500">⚠</span>
                                {/if}
                                <span>{$message}</span>
                            </p>
                        </div>
                    {/if}

                    <!-- General validation errors -->
                    {#if $allErrors.length > 0}
                        <div class="mt-4 p-3 rounded-lg bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 theme-transition">
                            <h4 class="text-sm font-semibold text-red-800 dark:text-red-400 mb-2">Please fix the following errors:</h4>
                            <ul class="text-sm text-red-700 dark:text-red-400 space-y-1">
                                {#each $allErrors as error}
                                    <li class="flex items-center space-x-2">
                                        <span class="text-red-500">•</span>
                                        <span>{error.messages.join(', ')}</span>
                                    </li>
                                {/each}
                            </ul>
                        </div>
                    {/if}
                </div>

                <!-- Scrollable Content -->
                <div class="flex-1 overflow-y-auto min-h-0">
                    <form
                        use:enhance
                        method="POST"
                        class="flex flex-col h-full"
                    >
                        <div class="flex-1 overflow-y-auto p-6">
                            <ProductFormFields {form} {errors} {constraints} />
                        </div>

                        <!-- Fixed footer with buttons -->
                        <div class="flex-shrink-0 flex w-full justify-end p-6 pt-4 border-t border-gray-200 gap-3">
                            <Button.Root
                                type="button"
                                class="inline-flex items-center justify-center space-x-2 px-6 py-3 border border-border-input rounded-xl text-sm font-semibold text-foreground-alt bg-background-alt hover:bg-muted focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent theme-transition-fast shadow-sm"
                                onclick={() => setOpen(false)}
                            >
                                <X class="w-4 h-4"/>
                                <span>Cancel</span>
                            </Button.Root>

                            <Button.Root
                                type="submit"
                                class="inline-flex items-center justify-center space-x-2 px-6 py-3 border border-transparent rounded-xl text-sm font-semibold text-accent-foreground bg-accent hover:bg-accent focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent theme-transition-fast shadow-sm"
                            >
                                <FloppyDisk class="w-4 h-4 theme-transition"/>
                                <span>{product ? 'Update Product' : 'Create Product'}</span>
                            </Button.Root>
                        </div>
                    </form>
                </div>
            </Dialog.Content>
        </Dialog.Portal>
    </Dialog.Root>
{:else}
    <form
        use:enhance
        method="POST"
        class="flex flex-col h-full"
    >
        <div class="flex-1 overflow-y-auto p-6">
            <ProductFormFields {form} {errors} {constraints} />
        </div>

        <!-- Fixed footer with buttons -->
        <div class="flex w-full justify-end pt-4 flex-shrink-0 gap-3 p-2">
            {#if onClose}
                <Button.Root
                    type="button"
                    class="inline-flex items-center justify-center space-x-2 px-6 py-3 border border-border-input rounded-xl text-sm font-semibold text-foreground-alt bg-background-alt hover:bg-muted focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent theme-transition-fast shadow-sm"
                    onclick={onClose}
                >
                    <X class="w-4 h-4"/>
                    <span>Cancel</span>
                </Button.Root>
            {/if}

            <Button.Root
                type="submit"
                class="inline-flex items-center justify-center space-x-2 px-6 py-3 border border-transparent rounded-xl text-sm font-semibold text-accent-foreground bg-accent hover:bg-accent focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent theme-transition-fast shadow-sm"
            >
                <FloppyDisk class="w-4 h-4 theme-transition"/>
                <span>{product ? 'Update Product' : 'Create Product'}</span>
            </Button.Root>
        </div>
    </form>
{/if}