<script lang="ts">
    import Copy from "phosphor-svelte/lib/Copy";
    import Trash from "phosphor-svelte/lib/Trash";
    import { slide } from 'svelte/transition';
    import { cubicOut } from 'svelte/easing';

    interface Props {
        selectedCount: number;
        onClearSelection: () => void;
        onBulkCopy: () => void;
        onBulkDelete: () => void;
    }

    let {
        selectedCount,
        onClearSelection,
        onBulkCopy,
        onBulkDelete
    }: Props = $props();
</script>

<div
    class="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-4 theme-transition"
    transition:slide={{
        duration: 200,
        easing: cubicOut
    }}
>
    <div class="flex items-center justify-between">
        <div class="flex items-center space-x-3">
            <span class="text-sm font-medium text-blue-900 dark:text-blue-100">
                {selectedCount} product{selectedCount === 1 ? '' : 's'} selected
            </span>
            <button
                onclick={onClearSelection}
                class="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200 underline theme-transition-fast"
            >
                Clear selection
            </button>
        </div>
        <div class="flex items-center space-x-2">
            <button
                onclick={onBulkCopy}
                class="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-green-700 dark:text-green-400 bg-green-100 dark:bg-green-900/30 hover:bg-green-200 dark:hover:bg-green-900/50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 theme-transition-fast"
            >
                <Copy class="w-4 h-4 mr-2 theme-transition" />
                Copy Selected
            </button>
            <button
                onclick={onBulkDelete}
                class="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-red-700 dark:text-red-400 bg-red-100 dark:bg-red-900/30 hover:bg-red-200 dark:hover:bg-red-900/50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 theme-transition-fast"
            >
                <Trash class="w-4 h-4 mr-2 theme-transition" />
                Delete Selected
            </button>
        </div>
    </div>
</div>