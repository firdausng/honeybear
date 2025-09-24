<script lang="ts">
    import MagnifyingGlass from "phosphor-svelte/lib/MagnifyingGlass";
    import Plus from "phosphor-svelte/lib/Plus";
    import GridFour from "phosphor-svelte/lib/GridFour";
    import List from "phosphor-svelte/lib/List";

    interface Props {
        searchTerm: string;
        categoryFilter: string;
        viewMode: 'grid' | 'list';
        categories: string[];
        onSearchChange: (value: string) => void;
        onCategoryChange: (value: string) => void;
        onViewModeChange: (mode: 'grid' | 'list') => void;
        onAddProduct: () => void;
    }

    let {
        searchTerm,
        categoryFilter,
        viewMode,
        categories,
        onSearchChange,
        onCategoryChange,
        onViewModeChange,
        onAddProduct
    }: Props = $props();
</script>

<div class="flex flex-col space-y-4 lg:flex-row lg:justify-between lg:items-center lg:space-y-0">
    <div class="flex flex-col space-y-4 sm:flex-row sm:items-center sm:space-y-0 sm:space-x-4">
        <div class="relative theme-transition">
            <MagnifyingGlass class="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4 theme-transition" />
            <input
                type="text"
                placeholder="Search products..."
                bind:value={searchTerm}
                oninput={(e) => onSearchChange(e.target.value)}
                class="pl-10 pr-4 py-2 border border-border-input bg-background-alt text-foreground placeholder:text-muted-foreground rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent w-full sm:w-80 theme-transition"
            />
        </div>

        <select
            bind:value={categoryFilter}
            onchange={(e) => onCategoryChange(e.target.value)}
            class="px-4 py-2 border border-border-input bg-background-alt text-foreground rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent w-full sm:w-auto theme-transition"
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
        <div class="relative flex rounded-lg p-1 theme-transition bg-background-alt border border-border-input">
            <!-- Sliding background indicator -->
            <div
                class="absolute top-1 bottom-1 bg-background shadow-sm rounded-md theme-transition-fast transition-all duration-300 ease-in-out transform"
                style="width: calc(50% - 2px); left: {viewMode === 'grid' ? '2px' : 'calc(50%)'}"
            ></div>

            <button
                onclick={() => onViewModeChange('grid')}
                class={`relative z-10 px-3 py-2 rounded-md text-sm font-medium theme-transition-fast cursor-pointer transition-colors duration-200 ${
                    viewMode === 'grid'
                        ? 'text-foreground'
                        : 'text-muted-foreground hover:text-foreground'
                }`}
            >
                <GridFour class="w-4 h-4 theme-transition" />
            </button>
            <button
                onclick={() => onViewModeChange('list')}
                class={`relative z-10 px-3 py-2 rounded-md text-sm font-medium theme-transition-fast cursor-pointer transition-colors duration-200 ${
                    viewMode === 'list'
                        ? 'text-foreground'
                        : 'text-muted-foreground hover:text-foreground'
                }`}
            >
                <List class="w-4 h-4 theme-transition" />
            </button>
        </div>

        <button
            onclick={onAddProduct}
            class="bg-accent hover:bg-accent/90 text-accent-foreground px-4 py-2 rounded-lg flex items-center justify-center space-x-2 theme-transition-fast w-full sm:w-auto"
        >
            <Plus class="w-4 h-4 theme-transition" />
            <span>Add Product</span>
        </button>
    </div>
</div>