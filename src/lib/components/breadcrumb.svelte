<script lang="ts">
    import CaretRight from "phosphor-svelte/lib/CaretRight";
    import HouseSimple from "phosphor-svelte/lib/HouseSimple";

    interface BreadcrumbItem {
        label: string;
        href: string;
        icon?: any;
    }

    interface Props {
        items: BreadcrumbItem[];
    }

    let { items }: Props = $props();
</script>

<nav class="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400 mb-6" aria-label="Breadcrumb">
    <ol class="flex items-center space-x-2">
        {#each items as item, index}
            <li class="flex items-center">
                {#if index > 0}
                    <CaretRight class="w-4 h-4 text-gray-400 mx-2" />
                {/if}

                {#if index === items.length - 1}
                    <!-- Current page - not a link -->
                    <span class="flex items-center space-x-1 text-gray-900 dark:text-gray-200 font-medium">
                        {#if item.icon}
                            <item.icon class="w-4 h-4" />
                        {/if}
                        <span>{item.label}</span>
                    </span>
                {:else}
                    <!-- Previous pages - links -->
                    <a
                        href={item.href}
                        class="flex items-center space-x-1 hover:text-gray-900 transition-colors"
                    >
                        {#if item.icon}
                            <item.icon class="w-4 h-4" />
                        {/if}
                        <span>{item.label}</span>
                    </a>
                {/if}
            </li>
        {/each}
    </ol>
</nav>