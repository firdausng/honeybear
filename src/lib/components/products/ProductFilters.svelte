<script lang="ts">
    import MagnifyingGlass from "phosphor-svelte/lib/MagnifyingGlass";
    import Plus from "phosphor-svelte/lib/Plus";
    import GridFour from "phosphor-svelte/lib/GridFour";
    import List from "phosphor-svelte/lib/List";
    import { Select, type WithoutChildren } from "bits-ui";
    import Package from "phosphor-svelte/lib/Package";
    import Check from "phosphor-svelte/lib/Check";
    import Funnel from "phosphor-svelte/lib/Funnel";
    import CaretUpDown from "phosphor-svelte/lib/CaretUpDown";
    import CaretDoubleUp from "phosphor-svelte/lib/CaretDoubleUp";
    import CaretDoubleDown from "phosphor-svelte/lib/CaretDoubleDown";

    interface Props {
        searchTerm: string;
        categoryFilter: string;
        viewMode: 'grid' | 'list';
        categories: { value:string, label:string, disabled?:boolean }[];
        onSearchChange: (value: string) => void;
        onCategoryChange: (value: string) => void;
        onViewModeChange: (mode: 'grid' | 'list') => void;
        onAddProduct: () => void;
    }

    let {
        searchTerm,
        categoryFilter=$bindable(),
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

        <Select.Root
                type="single"
                onValueChange={(v) => (categoryFilter = v)}
                items={categories}
                allowDeselect={true}
        >
            <Select.Trigger
                    class="h-input rounded-9px border-border-input bg-background data-placeholder:text-foreground-alt/50 inline-flex w-[296px] touch-none select-none items-center border px-[11px] text-sm transition-colors"
                    aria-label="Select a Category"
            >
                <Funnel class="text-muted-foreground mr-[9px] size-6" />
                {categoryFilter}
                <CaretUpDown class="text-muted-foreground ml-auto size-6" />
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
<!--        <select-->
<!--            bind:value={categoryFilter}-->
<!--            onchange={(e) => onCategoryChange(e.target.value)}-->
<!--            class="px-4 py-2 border border-border-input bg-background-alt text-foreground rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent w-full sm:w-auto theme-transition"-->
<!--        >-->
<!--            {#each categories as category (category)}-->
<!--                <option value={category}>-->
<!--                    {category.value === 'all' ? 'All Categories' : category}-->
<!--                </option>-->
<!--            {/each}-->
<!--        </select>-->
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