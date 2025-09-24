<script lang="ts">
    import {Label, Checkbox, Button} from "bits-ui";
    import Rows from "phosphor-svelte/lib/Rows";
    import TipJar from "phosphor-svelte/lib/TipJar";
    import Barcode from "phosphor-svelte/lib/Barcode";
    import Check from "phosphor-svelte/lib/Check";
    import Minus from "phosphor-svelte/lib/Minus";

    interface Props {
        form: any;
        errors: any;
        constraints: any;
    }

    let { form, errors, constraints }: Props = $props();

    const categories = ['Electronics', 'Clothing', 'Photography', 'Furniture', 'Books', 'Sports', 'Beauty'];
</script>

<div class="space-y-8">
    <!-- Basic Information Section -->
    <div class="space-y-6">
        <div class="border-b border-gray-200 dark:border-gray-700 pb-4">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white flex items-center space-x-2">
                <Rows class="w-5 h-5 text-foreground"/>
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
                <TipJar class="w-5 h-5 text-foreground"/>
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
                <Barcode class="w-5 h-5 text-foreground"/>
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
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                            <option value="out_of_stock">Out of Stock</option>
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
                            class="flex size-6 items-center justify-center rounded-lg border-2 {$errors.featured ? 'border-red-300 bg-red-50 data-[state=checked]:border-red-500 data-[state=checked]:bg-red-500' : 'border-border-input bg-background-alt data-[state=checked]:border-accent data-[state=checked]:bg-accent-foreground'} hover:border-border-card theme-transition"
                            name="featured"
                            aria-invalid={$errors.featured ? 'true' : undefined}
                            aria-describedby={$errors.featured ? 'featured-error' : undefined}
                            bind:checked={$form.featured}
                            {...$constraints.featured}
                        >
                            {#snippet children({ checked, indeterminate })}
                                <div class="text-background inline-flex items-center justify-center">
                                    {#if indeterminate}
                                        <Minus class="size-[15px]" weight="bold" />
                                    {:else if checked}
                                        <Check class="size-[15px]" weight="bold" />
                                    {/if}
                                </div>
                            {/snippet}
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