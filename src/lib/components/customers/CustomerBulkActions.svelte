<script lang="ts">
    import { Button } from "bits-ui";
    import X from "phosphor-svelte/lib/X";
    import Envelope from "phosphor-svelte/lib/Envelope";
    import UserMinus from "phosphor-svelte/lib/UserMinus";
    import Export from "phosphor-svelte/lib/Export";

    interface Props {
        selectedCount: number;
        onClearSelection: () => void;
        onBulkEmail?: () => void;
        onBulkDeactivate?: () => void;
        onBulkExport?: () => void;
    }

    let {
        selectedCount,
        onClearSelection,
        onBulkEmail,
        onBulkDeactivate,
        onBulkExport
    }: Props = $props();
</script>

<div class="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 max-w-md w-full mx-4">
    <div class="bg-accent text-accent-foreground rounded-xl shadow-lg border border-accent/20 p-4 theme-transition">
        <div class="flex items-center justify-between mb-3">
            <div class="flex items-center space-x-2">
                <span class="text-sm font-semibold">{selectedCount} customer{selectedCount !== 1 ? 's' : ''} selected</span>
            </div>
            <Button.Root
                onclick={onClearSelection}
                class="p-1 hover:bg-accent-foreground/10 rounded-md theme-transition-fast"
            >
                <X class="w-4 h-4" />
            </Button.Root>
        </div>

        <div class="flex items-center space-x-2">
            {#if onBulkEmail}
                <Button.Root
                    onclick={onBulkEmail}
                    class="flex-1 bg-accent-foreground/10 hover:bg-accent-foreground/20 px-3 py-2 rounded-lg text-xs font-medium theme-transition-fast flex items-center justify-center space-x-1"
                >
                    <Envelope class="w-4 h-4" />
                    <span>Email</span>
                </Button.Root>
            {/if}

            {#if onBulkExport}
                <Button.Root
                    onclick={onBulkExport}
                    class="flex-1 bg-accent-foreground/10 hover:bg-accent-foreground/20 px-3 py-2 rounded-lg text-xs font-medium theme-transition-fast flex items-center justify-center space-x-1"
                >
                    <Export class="w-4 h-4" />
                    <span>Export</span>
                </Button.Root>
            {/if}

            {#if onBulkDeactivate}
                <Button.Root
                    onclick={onBulkDeactivate}
                    class="flex-1 bg-red-500/20 hover:bg-red-500/30 px-3 py-2 rounded-lg text-xs font-medium theme-transition-fast flex items-center justify-center space-x-1"
                >
                    <UserMinus class="w-4 h-4" />
                    <span>Deactivate</span>
                </Button.Root>
            {/if}
        </div>
    </div>
</div>