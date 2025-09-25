<script lang="ts">
    import { Button } from "bits-ui";
    import PushPin from "phosphor-svelte/lib/PushPin";
    import PushPinSlash from "phosphor-svelte/lib/PushPinSlash";
    import { stickyModeStore } from "$lib/sticky-mode.svelte";

    interface Props {
        size?: 'sm' | 'md';
        showLabel?: boolean;
    }

    let { size = 'md', showLabel = true }: Props = $props();

    const sizeClasses = {
        sm: 'p-1.5',
        md: 'px-3 py-2'
    };

    const iconSizes = {
        sm: 'w-3 h-3',
        md: 'w-4 h-4'
    };
</script>

<Button.Root
    onclick={() => stickyModeStore.toggle()}
    class="flex items-center space-x-2 {sizeClasses[size]} rounded-lg bg-background-alt hover:bg-muted text-foreground-alt hover:text-foreground border border-border-input theme-transition-fast"
    title={stickyModeStore.isSticky ? 'Disable sticky headers' : 'Enable sticky headers'}
>
    {#if stickyModeStore.isSticky}
        <PushPin class="{iconSizes[size]} theme-transition" />
    {:else}
        <PushPinSlash class="{iconSizes[size]} theme-transition" />
    {/if}
    {#if showLabel}
        <span class="text-xs font-medium">
            {stickyModeStore.isSticky ? 'Sticky' : 'Static'}
        </span>
    {/if}
</Button.Root>