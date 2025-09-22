<script lang="ts">
    import {Dialog, Label, Separator, Checkbox, Button, Select} from "bits-ui";
    import LockKeyOpen from "phosphor-svelte/lib/LockKeyOpen";
    import Package from "phosphor-svelte/lib/Package";
    import FloppyDisk from "phosphor-svelte/lib/FloppyDisk";
    import Check from "phosphor-svelte/lib/Check";
    import Minus from "phosphor-svelte/lib/Minus";
    import X from "phosphor-svelte/lib/X";
    import PencilLine from "phosphor-svelte/lib/PencilLine";
    import SuperDebug, {type Infer, superForm, type SuperValidated} from "sveltekit-superforms";
    import {valibot} from "sveltekit-superforms/adapters";
    import {type ProductSchema, productSchema} from "$lib/schema";

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

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'delivered':
                return 'bg-green-100 text-green-800 border-green-200';
            case 'shipped':
                return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'processing':
                return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'pending':
                return 'bg-gray-100 text-gray-800 border-gray-200';
            case 'cancelled':
                return 'bg-red-100 text-red-800 border-red-200';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const {form, errors, constraints, enhance, reset, message, tainted, allErrors} = superForm(formData, {
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

    const categories = ['Electronics', 'Clothing', 'Photography', 'Furniture', 'Books', 'Sports', 'Beauty'];
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

                    <Separator.Root class="bg-muted -mx-5 mb-0 mt-5 block h-px"/>
                </div>

                <!-- Scrollable Content -->
                <div class="flex-1 overflow-y-auto min-h-0">
                    <form
                            use:enhance
                            method="POST"
                            class="flex flex-col h-full"
                    >
                        <div class="flex-1 overflow-y-auto p-6">
                            <div class="space-y-8">
                                <!-- Basic Information Section -->
                                <div class="space-y-6">
                                    <div class="border-b border-gray-200 dark:border-gray-700 pb-4">
                                        <h3 class="text-lg font-semibold text-gray-900 dark:text-white flex items-center space-x-2">
                                            <Package class="w-5 h-5 text-accent"/>
                                            <span>Basic Information</span>
                                        </h3>
                                        <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">Enter the core details about your product</p>
                                    </div>

                                    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                        <div class="space-y-2">
                                            <Label.Root for="name" class="text-sm font-semibold text-gray-800 dark:text-gray-200">
                                                Product Name *
                                            </Label.Root>
                                            <input
                                                    id="name"
                                                    name="name"
                                                    type="text"
                                                    class="w-full px-4 py-3 border {$errors.name ? 'border-red-300 bg-red-50 focus:ring-red-500 focus:border-red-500' : 'border-border-input bg-background-alt focus:ring-accent focus:border-accent'} rounded-xl focus:outline-none focus:ring-2 theme-transition-fast shadow-sm hover:border-border-card text-foreground placeholder-muted-foreground"
                                                    placeholder="Enter product name"
                                                    aria-invalid={$errors.name ? 'true' : undefined}
                                                    aria-describedby={$errors.name ? 'name-error' : undefined}
                                                    bind:value={$form.name}
                                                    {...$constraints.name}
                                            />
                                            {#if $errors.name}
                                                <p id="name-error" class="text-sm text-red-600 dark:text-red-400 dark:text-red-400 flex items-center space-x-1 animate-in slide-in-from-top-1 duration-200">
                                                    <svg class="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
                                                    </svg>
                                                    <span>{$errors.name[0]}</span>
                                                </p>
                                            {/if}
                                        </div>

                                        <div class="space-y-2">
                                            <Label.Root for="category" class="text-sm font-semibold text-gray-800 dark:text-gray-200">
                                                Category *
                                            </Label.Root>
                                            <div class="relative">
                                                <select
                                                        id="category"
                                                        name="category"
                                                        bind:value={$form.category}
                                                        class="w-full px-4 py-3 border {$errors.category ? 'border-red-300 bg-red-50 focus:ring-red-500 focus:border-red-500' : 'border-border-input bg-background-alt focus:ring-accent focus:border-accent'} rounded-xl focus:outline-none focus:ring-2 theme-transition-fast shadow-sm hover:border-border-card appearance-none cursor-pointer pr-10 text-foreground"
                                                        aria-invalid={$errors.category ? 'true' : undefined}
                                                        aria-describedby={$errors.category ? 'category-error' : undefined}
                                                        {...$constraints.category}
                                                >
                                                    <option value="">Select category</option>
                                                    {#each categories as category(category)}
                                                        <option value={category}>{category}</option>
                                                    {/each}
                                                </select>
                                                <!-- Custom dropdown arrow -->
                                                <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                                    <svg class="w-5 h-5 {$errors.category ? 'text-red-400' : 'text-muted-foreground'}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                                                    </svg>
                                                </div>
                                            </div>
                                            {#if $errors.category}
                                                <p id="category-error" class="text-sm text-red-600 dark:text-red-400 dark:text-red-400 flex items-center space-x-1 animate-in slide-in-from-top-1 duration-200">
                                                    <svg class="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
                                                    </svg>
                                                    <span>{$errors.category[0]}</span>
                                                </p>
                                            {/if}
                                        </div>
                                    </div>
                                </div>

                                <!-- Pricing & Inventory Section -->
                                <div class="space-y-6">
                                    <div class="border-b border-gray-200 dark:border-gray-700 pb-4">
                                        <h3 class="text-lg font-semibold text-gray-900 dark:text-white flex items-center space-x-2">
                                            <span class="text-accent">💰</span>
                                            <span>Pricing & Inventory</span>
                                        </h3>
                                        <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">Set pricing and track inventory levels</p>
                                    </div>

                                    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                        <div class="space-y-2">
                                            <Label.Root for="price" class="text-sm font-semibold text-gray-800 dark:text-gray-200">
                                                Price *
                                            </Label.Root>
                                            <div class="relative">
                                                <span class="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">$</span>
                                                <input
                                                        id="price"
                                                        name="price"
                                                        min="0"
                                                        step="0.01"
                                                        class="w-full pl-8 pr-4 py-3 border {$errors.price ? 'border-red-300 bg-red-50 focus:ring-red-500 focus:border-red-500' : 'border-border-input bg-background-alt focus:ring-accent focus:border-accent'} rounded-xl focus:outline-none focus:ring-2 theme-transition-fast shadow-sm hover:border-border-card text-foreground placeholder-muted-foreground"
                                                        placeholder="0.00"
                                                        aria-invalid={$errors.price ? 'true' : undefined}
                                                        aria-describedby={$errors.price ? 'price-error' : undefined}
                                                        bind:value={$form.price}
                                                        {...$constraints.price}
                                                />
                                            </div>
                                            {#if $errors.price}
                                                <p id="price-error" class="text-sm text-red-600 dark:text-red-400 flex items-center space-x-1 animate-in slide-in-from-top-1 duration-200">
                                                    <svg class="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
                                                    </svg>
                                                    <span>{$errors.price[0]}</span>
                                                </p>
                                            {/if}
                                        </div>

                                        <div class="space-y-2">
                                            <Label.Root for="stock" class="text-sm font-semibold text-gray-800 dark:text-gray-200">
                                                Stock Quantity *
                                            </Label.Root>
                                            <input
                                                    id="stock"
                                                    name="stock"
                                                    type="number"
                                                    required
                                                    min="0"
                                                    class="w-full px-4 py-3 border {$errors.stock ? 'border-red-300 bg-red-50 focus:ring-red-500 focus:border-red-500' : 'border-border-input bg-background-alt focus:ring-accent focus:border-accent'} rounded-xl focus:outline-none focus:ring-2 theme-transition-fast shadow-sm hover:border-border-card text-foreground placeholder-muted-foreground"
                                                    placeholder="0"
                                                    aria-invalid={$errors.stock ? 'true' : undefined}
                                                    aria-describedby={$errors.stock ? 'stock-error' : undefined}
                                                    bind:value={$form.stock}
                                                    {...$constraints.stock}
                                            />
                                            {#if $errors.stock}
                                                <p id="stock-error" class="text-sm text-red-600 dark:text-red-400 flex items-center space-x-1 animate-in slide-in-from-top-1 duration-200">
                                                    <svg class="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
                                                    </svg>
                                                    <span>{$errors.stock[0]}</span>
                                                </p>
                                            {/if}
                                        </div>

                                        <div class="space-y-2">
                                            <Label.Root for="sku" class="text-sm font-semibold text-gray-800 dark:text-gray-200">
                                                SKU *
                                            </Label.Root>
                                            <input
                                                    id="sku"
                                                    name="sku"
                                                    class="w-full px-4 py-3 border {$errors.sku ? 'border-red-300 bg-red-50 focus:ring-red-500 focus:border-red-500' : 'border-border-input bg-background-alt focus:ring-accent focus:border-accent'} rounded-xl focus:outline-none focus:ring-2 theme-transition-fast shadow-sm hover:border-border-card text-foreground placeholder-muted-foreground"
                                                    placeholder="Enter SKU"
                                                    aria-invalid={$errors.sku ? 'true' : undefined}
                                                    aria-describedby={$errors.sku ? 'sku-error' : undefined}
                                                    bind:value={$form.sku}
                                                    {...$constraints.sku}
                                            />
                                            {#if $errors.sku}
                                                <p id="sku-error" class="text-sm text-red-600 dark:text-red-400 flex items-center space-x-1 animate-in slide-in-from-top-1 duration-200">
                                                    <svg class="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
                                                    </svg>
                                                    <span>{$errors.sku[0]}</span>
                                                </p>
                                            {/if}
                                        </div>
                                    </div>
                                </div>

                                <!-- Product Details Section -->
                                <div class="space-y-6">
                                    <div class="border-b border-gray-200 dark:border-gray-700 pb-4">
                                        <h3 class="text-lg font-semibold text-gray-900 dark:text-white flex items-center space-x-2">
                                            <span class="text-accent">📝</span>
                                            <span>Product Details</span>
                                        </h3>
                                        <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">Add description, images, and settings</p>
                                    </div>

                                    <div class="space-y-6">
                                        <div class="space-y-2">
                                            <Label.Root for="description" class="text-sm font-semibold text-gray-800 dark:text-gray-200">
                                                Description *
                                            </Label.Root>
                                            <textarea
                                                    id="description"
                                                    name="description"
                                                    required
                                                    rows="4"
                                                    class="w-full px-4 py-3 border {$errors.description ? 'border-red-300 bg-red-50 focus:ring-red-500 focus:border-red-500' : 'border-border-input bg-background-alt focus:ring-accent focus:border-accent'} rounded-xl focus:outline-none focus:ring-2 theme-transition-fast shadow-sm hover:border-border-card resize-y min-h-[120px] text-foreground placeholder-muted-foreground"
                                                    placeholder="Enter a detailed product description..."
                                                    aria-invalid={$errors.description ? 'true' : undefined}
                                                    aria-describedby={$errors.description ? 'description-error' : undefined}
                                                    bind:value={$form.description}
                                                    {...$constraints.description}
                                            ></textarea>
                                            {#if $errors.description}
                                                <p id="description-error" class="text-sm text-red-600 dark:text-red-400 flex items-center space-x-1 animate-in slide-in-from-top-1 duration-200">
                                                    <svg class="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
                                                    </svg>
                                                    <span>{$errors.description[0]}</span>
                                                </p>
                                            {/if}
                                        </div>

                                        <div class="space-y-2">
                                            <Label.Root for="image" class="text-sm font-semibold text-gray-800 dark:text-gray-200">
                                                Image URL *
                                            </Label.Root>
                                            <input
                                                    id="image"
                                                    name="image"
                                                    type="url"
                                                    class="w-full px-4 py-3 border {$errors.image ? 'border-red-300 bg-red-50 focus:ring-red-500 focus:border-red-500' : 'border-border-input bg-background-alt focus:ring-accent focus:border-accent'} rounded-xl focus:outline-none focus:ring-2 theme-transition-fast shadow-sm hover:border-border-card text-foreground placeholder-muted-foreground"
                                                    placeholder="https://example.com/image.jpg"
                                                    aria-invalid={$errors.image ? 'true' : undefined}
                                                    aria-describedby={$errors.image ? 'image-error' : undefined}
                                                    bind:value={$form.image}
                                                    {...$constraints.image}
                                            />
                                            {#if $errors.image}
                                                <p id="image-error" class="text-sm text-red-600 dark:text-red-400 flex items-center space-x-1 animate-in slide-in-from-top-1 duration-200">
                                                    <svg class="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
                                                    </svg>
                                                    <span>{$errors.image[0]}</span>
                                                </p>
                                            {/if}
                                        </div>

                                        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                            <div class="space-y-2">
                                                <Label.Root for="status" class="text-sm font-semibold text-gray-800 dark:text-gray-200">
                                                    Status *
                                                </Label.Root>
                                                <div class="relative">
                                                    <select
                                                            id="status"
                                                            name="status"
                                                            bind:value={$form.status}
                                                            class="w-full px-4 py-3 border {$errors.status ? 'border-red-300 bg-red-50 focus:ring-red-500 focus:border-red-500' : 'border-border-input bg-background-alt focus:ring-accent focus:border-accent'} rounded-xl focus:outline-none focus:ring-2 theme-transition-fast shadow-sm hover:border-border-card appearance-none cursor-pointer pr-10 text-foreground"
                                                            aria-invalid={$errors.status ? 'true' : undefined}
                                                            aria-describedby={$errors.status ? 'status-error' : undefined}
                                                            {...$constraints.status}
                                                    >
                                                        <option value="">Select status</option>
                                                        <option value="active">🟢 Active</option>
                                                        <option value="inactive">⚫ Inactive</option>
                                                        <option value="out_of_stock">🔴 Out of Stock</option>
                                                    </select>
                                                    <!-- Custom dropdown arrow -->
                                                    <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                                        <svg class="w-5 h-5 {$errors.status ? 'text-red-400' : 'text-muted-foreground'}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                                                        </svg>
                                                    </div>
                                                </div>
                                                {#if $errors.status}
                                                    <p id="status-error" class="text-sm text-red-600 dark:text-red-400 flex items-center space-x-1 animate-in slide-in-from-top-1 duration-200">
                                                        <svg class="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                                            <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
                                                        </svg>
                                                        <span>{$errors.status[0]}</span>
                                                    </p>
                                                {/if}
                                            </div>

                                            <div class="space-y-2">
                                                <Label.Root class="text-sm font-semibold text-gray-800 dark:text-gray-200">
                                                    Product Settings
                                                </Label.Root>
                                                <div class="flex items-center space-x-3 p-4 {$errors.featured ? 'bg-red-50 border-red-200' : 'bg-background-alt border-border-input'} rounded-xl border theme-transition">
                                                    <Checkbox.Root
                                                            id="featured"
                                                            class="flex size-6 items-center justify-center rounded-lg border-2 {$errors.featured ? 'border-red-300 bg-red-50 data-[state=checked]:border-red-500 data-[state=checked]:bg-red-500' : 'border-border-input bg-background-alt data-[state=checked]:border-accent data-[state=checked]:bg-accent'} hover:border-border-card theme-transition"
                                                            name="featured"
                                                            aria-invalid={$errors.featured ? 'true' : undefined}
                                                            aria-describedby={$errors.featured ? 'featured-error' : undefined}
                                                            bind:checked={$form.featured}
                                                            {...$constraints.featured}
                                                    >
                                                        <Checkbox.Indicator class="flex items-center justify-center text-white">
                                                            <Check class="size-4 theme-transition" weight="bold"/>
                                                        </Checkbox.Indicator>
                                                    </Checkbox.Root>
                                                    <Label.Root
                                                            for="featured"
                                                            class="text-sm font-medium {$errors.featured ? 'text-red-800' : 'text-foreground'} cursor-pointer"
                                                    >
                                                        Featured Product
                                                    </Label.Root>
                                                </div>
                                                {#if $errors.featured}
                                                    <p id="featured-error" class="text-sm text-red-600 dark:text-red-400 flex items-center space-x-1 animate-in slide-in-from-top-1 duration-200">
                                                        <svg class="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                                            <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
                                                        </svg>
                                                        <span>{$errors.featured[0]}</span>
                                                    </p>
                                                {/if}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
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
            <div class="space-y-8">
                <!-- Basic Information Section -->
                <div class="space-y-6">
                    <div class="border-b border-gray-200 dark:border-gray-700 pb-4">
                        <h3 class="text-lg font-semibold text-gray-900 dark:text-white flex items-center space-x-2">
                            <Package class="w-5 h-5 text-accent"/>
                            <span>Basic Information</span>
                        </h3>
                        <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">Enter the core details about your product</p>
                    </div>

                    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div class="space-y-2">
                            <Label.Root for="name" class="text-sm font-semibold text-gray-800 dark:text-gray-200">
                                Product Name *
                            </Label.Root>
                            <input
                                    id="name"
                                    name="name"
                                    type="text"
                                    class="w-full px-4 py-3 border {$errors.name ? 'border-red-300 bg-red-50 focus:ring-red-500 focus:border-red-500' : 'border-border-input bg-background-alt focus:ring-accent focus:border-accent'} rounded-xl focus:outline-none focus:ring-2 theme-transition-fast shadow-sm hover:border-border-card text-foreground placeholder-muted-foreground"
                                    placeholder="Enter product name"
                                    aria-invalid={$errors.name ? 'true' : undefined}
                                    aria-describedby={$errors.name ? 'name-error' : undefined}
                                    bind:value={$form.name}
                                    {...$constraints.name}
                            />
                            {#if $errors.name}
                                <p id="name-error" class="text-sm text-red-600 dark:text-red-400 flex items-center space-x-1 animate-in slide-in-from-top-1 duration-200">
                                    <svg class="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                        <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
                                    </svg>
                                    <span>{$errors.name[0]}</span>
                                </p>
                            {/if}
                        </div>

                        <div class="space-y-2">
                            <Label.Root for="category" class="text-sm font-semibold text-gray-800 dark:text-gray-200">
                                Category *
                            </Label.Root>
                            <div class="relative">
                                <select
                                        id="category"
                                        name="category"
                                        bind:value={$form.category}
                                        class="w-full px-4 py-3 border {$errors.category ? 'border-red-300 bg-red-50 focus:ring-red-500 focus:border-red-500' : 'border-border-input bg-background-alt focus:ring-accent focus:border-accent'} rounded-xl focus:outline-none focus:ring-2 theme-transition-fast shadow-sm hover:border-border-card appearance-none cursor-pointer pr-10 text-foreground"
                                        aria-invalid={$errors.category ? 'true' : undefined}
                                        aria-describedby={$errors.category ? 'category-error' : undefined}
                                        {...$constraints.category}
                                >
                                    <option value="">Select category</option>
                                    {#each categories as category(category)}
                                        <option value={category}>{category}</option>
                                    {/each}
                                </select>
                                <!-- Custom dropdown arrow -->
                                <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                    <svg class="w-5 h-5 {$errors.category ? 'text-red-400' : 'text-muted-foreground'}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                                    </svg>
                                </div>
                            </div>
                            {#if $errors.category}
                                <p id="category-error" class="text-sm text-red-600 dark:text-red-400 flex items-center space-x-1 animate-in slide-in-from-top-1 duration-200">
                                    <svg class="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                        <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
                                    </svg>
                                    <span>{$errors.category[0]}</span>
                                </p>
                            {/if}
                        </div>
                    </div>
                </div>

                <!-- Pricing & Inventory Section -->
                <div class="space-y-6">
                    <div class="border-b border-gray-200 dark:border-gray-700 pb-4">
                        <h3 class="text-lg font-semibold text-gray-900 dark:text-white flex items-center space-x-2">
                            <span class="text-accent">💰</span>
                            <span>Pricing & Inventory</span>
                        </h3>
                        <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">Set pricing and track inventory levels</p>
                    </div>

                    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div class="space-y-2">
                            <Label.Root for="price" class="text-sm font-semibold text-gray-800 dark:text-gray-200">
                                Price *
                            </Label.Root>
                            <div class="relative">
                                <span class="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">$</span>
                                <input
                                        id="price"
                                        name="price"
                                        min="0"
                                        step="0.01"
                                        class="w-full pl-8 pr-4 py-3 border {$errors.price ? 'border-red-300 bg-red-50 focus:ring-red-500 focus:border-red-500' : 'border-border-input bg-background-alt focus:ring-accent focus:border-accent'} rounded-xl focus:outline-none focus:ring-2 theme-transition-fast shadow-sm hover:border-border-card text-foreground placeholder-muted-foreground"
                                        placeholder="0.00"
                                        aria-invalid={$errors.price ? 'true' : undefined}
                                        aria-describedby={$errors.price ? 'price-error' : undefined}
                                        bind:value={$form.price}
                                        {...$constraints.price}
                                />
                            </div>
                            {#if $errors.price}
                                <p id="price-error" class="text-sm text-red-600 dark:text-red-400 flex items-center space-x-1 animate-in slide-in-from-top-1 duration-200">
                                    <svg class="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                        <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
                                    </svg>
                                    <span>{$errors.price[0]}</span>
                                </p>
                            {/if}
                        </div>

                        <div class="space-y-2">
                            <Label.Root for="stock" class="text-sm font-semibold text-gray-800 dark:text-gray-200">
                                Stock Quantity *
                            </Label.Root>
                            <input
                                    id="stock"
                                    name="stock"
                                    type="number"
                                    required
                                    min="0"
                                    class="w-full px-4 py-3 border {$errors.stock ? 'border-red-300 bg-red-50 focus:ring-red-500 focus:border-red-500' : 'border-border-input bg-background-alt focus:ring-accent focus:border-accent'} rounded-xl focus:outline-none focus:ring-2 theme-transition-fast shadow-sm hover:border-border-card text-foreground placeholder-muted-foreground"
                                    placeholder="0"
                                    aria-invalid={$errors.stock ? 'true' : undefined}
                                    aria-describedby={$errors.stock ? 'stock-error' : undefined}
                                    bind:value={$form.stock}
                                    {...$constraints.stock}
                            />
                            {#if $errors.stock}
                                <p id="stock-error" class="text-sm text-red-600 dark:text-red-400 flex items-center space-x-1 animate-in slide-in-from-top-1 duration-200">
                                    <svg class="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                        <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
                                    </svg>
                                    <span>{$errors.stock[0]}</span>
                                </p>
                            {/if}
                        </div>

                        <div class="space-y-2">
                            <Label.Root for="sku" class="text-sm font-semibold text-gray-800 dark:text-gray-200">
                                SKU *
                            </Label.Root>
                            <input
                                    id="sku"
                                    name="sku"
                                    class="w-full px-4 py-3 border {$errors.sku ? 'border-red-300 bg-red-50 focus:ring-red-500 focus:border-red-500' : 'border-border-input bg-background-alt focus:ring-accent focus:border-accent'} rounded-xl focus:outline-none focus:ring-2 theme-transition-fast shadow-sm hover:border-border-card text-foreground placeholder-muted-foreground"
                                    placeholder="Enter SKU"
                                    aria-invalid={$errors.sku ? 'true' : undefined}
                                    aria-describedby={$errors.sku ? 'sku-error' : undefined}
                                    bind:value={$form.sku}
                                    {...$constraints.sku}
                            />
                            {#if $errors.sku}
                                <p id="sku-error" class="text-sm text-red-600 dark:text-red-400 flex items-center space-x-1 animate-in slide-in-from-top-1 duration-200">
                                    <svg class="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                        <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
                                    </svg>
                                    <span>{$errors.sku[0]}</span>
                                </p>
                            {/if}
                        </div>
                    </div>
                </div>

                <!-- Product Details Section -->
                <div class="space-y-6">
                    <div class="border-b border-gray-200 dark:border-gray-700 pb-4">
                        <h3 class="text-lg font-semibold text-gray-900 dark:text-white flex items-center space-x-2">
                            <span class="text-accent">📝</span>
                            <span>Product Details</span>
                        </h3>
                        <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">Add description, images, and settings</p>
                    </div>

                    <div class="space-y-6">
                        <div class="space-y-2">
                            <Label.Root for="description" class="text-sm font-semibold text-gray-800 dark:text-gray-200">
                                Description *
                            </Label.Root>
                            <textarea
                                    id="description"
                                    name="description"
                                    required
                                    rows="4"
                                    class="w-full px-4 py-3 border {$errors.description ? 'border-red-300 bg-red-50 focus:ring-red-500 focus:border-red-500' : 'border-border-input bg-background-alt focus:ring-accent focus:border-accent'} rounded-xl focus:outline-none focus:ring-2 theme-transition-fast shadow-sm hover:border-border-card resize-y min-h-[120px] text-foreground placeholder-muted-foreground"
                                    placeholder="Enter a detailed product description..."
                                    aria-invalid={$errors.description ? 'true' : undefined}
                                    aria-describedby={$errors.description ? 'description-error' : undefined}
                                    bind:value={$form.description}
                                    {...$constraints.description}
                            ></textarea>
                            {#if $errors.description}
                                <p id="description-error" class="text-sm text-red-600 dark:text-red-400 flex items-center space-x-1 animate-in slide-in-from-top-1 duration-200">
                                    <svg class="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                        <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
                                    </svg>
                                    <span>{$errors.description[0]}</span>
                                </p>
                            {/if}
                        </div>

                        <div class="space-y-2">
                            <Label.Root for="image" class="text-sm font-semibold text-gray-800 dark:text-gray-200">
                                Image URL *
                            </Label.Root>
                            <input
                                    id="image"
                                    name="image"
                                    type="url"
                                    class="w-full px-4 py-3 border {$errors.image ? 'border-red-300 bg-red-50 focus:ring-red-500 focus:border-red-500' : 'border-border-input bg-background-alt focus:ring-accent focus:border-accent'} rounded-xl focus:outline-none focus:ring-2 theme-transition-fast shadow-sm hover:border-border-card text-foreground placeholder-muted-foreground"
                                    placeholder="https://example.com/image.jpg"
                                    aria-invalid={$errors.image ? 'true' : undefined}
                                    aria-describedby={$errors.image ? 'image-error' : undefined}
                                    bind:value={$form.image}
                                    {...$constraints.image}
                            />
                            {#if $errors.image}
                                <p id="image-error" class="text-sm text-red-600 dark:text-red-400 flex items-center space-x-1 animate-in slide-in-from-top-1 duration-200">
                                    <svg class="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                        <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
                                    </svg>
                                    <span>{$errors.image[0]}</span>
                                </p>
                            {/if}
                        </div>

                        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <div class="space-y-2">
                                <Label.Root for="status" class="text-sm font-semibold text-gray-800 dark:text-gray-200">
                                    Status *
                                </Label.Root>
                                <div class="relative">
                                    <select
                                            id="status"
                                            name="status"
                                            bind:value={$form.status}
                                            class="w-full px-4 py-3 border {$errors.status ? 'border-red-300 bg-red-50 focus:ring-red-500 focus:border-red-500' : 'border-border-input bg-background-alt focus:ring-accent focus:border-accent'} rounded-xl focus:outline-none focus:ring-2 theme-transition-fast shadow-sm hover:border-border-card appearance-none cursor-pointer pr-10 text-foreground"
                                            aria-invalid={$errors.status ? 'true' : undefined}
                                            aria-describedby={$errors.status ? 'status-error' : undefined}
                                            {...$constraints.status}
                                    >
                                        <option value="">Select status</option>
                                        <option value="active">🟢 Active</option>
                                        <option value="inactive">⚫ Inactive</option>
                                        <option value="out_of_stock">🔴 Out of Stock</option>
                                    </select>
                                    <!-- Custom dropdown arrow -->
                                    <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                        <svg class="w-5 h-5 {$errors.status ? 'text-red-400' : 'text-muted-foreground'}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                                        </svg>
                                    </div>
                                </div>
                                {#if $errors.status}
                                    <p id="status-error" class="text-sm text-red-600 dark:text-red-400 flex items-center space-x-1 animate-in slide-in-from-top-1 duration-200">
                                        <svg class="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                            <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
                                        </svg>
                                        <span>{$errors.status[0]}</span>
                                    </p>
                                {/if}
                            </div>

                            <div class="space-y-2">
                                <Label.Root class="text-sm font-semibold text-gray-800 dark:text-gray-200">
                                    Product Settings
                                </Label.Root>
                                <div class="flex items-center space-x-3 p-4 {$errors.featured ? 'bg-red-50 border-red-200' : 'bg-background-alt border-border-input'} rounded-xl border theme-transition">
                                    <Checkbox.Root
                                            id="featured"
                                            class="flex size-6 items-center justify-center rounded-lg border-2 {$errors.featured ? 'border-red-300 bg-red-50 data-[state=checked]:border-red-500 data-[state=checked]:bg-red-500' : 'border-border-input bg-background-alt data-[state=checked]:border-accent data-[state=checked]:bg-accent'} hover:border-border-card theme-transition"
                                            name="featured"
                                            aria-invalid={$errors.featured ? 'true' : undefined}
                                            aria-describedby={$errors.featured ? 'featured-error' : undefined}
                                            bind:checked={$form.featured}
                                            {...$constraints.featured}
                                    >
                                        <Checkbox.Indicator class="flex items-center justify-center text-white">
                                            <Check class="size-4 theme-transition" weight="bold"/>
                                        </Checkbox.Indicator>
                                    </Checkbox.Root>
                                    <Label.Root
                                            for="featured"
                                            class="text-sm font-medium {$errors.featured ? 'text-red-800' : 'text-foreground'} cursor-pointer"
                                    >
                                        Featured Product
                                    </Label.Root>
                                </div>
                                {#if $errors.featured}
                                    <p id="featured-error" class="text-sm text-red-600 dark:text-red-400 flex items-center space-x-1 animate-in slide-in-from-top-1 duration-200">
                                        <svg class="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                            <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
                                        </svg>
                                        <span>{$errors.featured[0]}</span>
                                    </p>
                                {/if}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
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