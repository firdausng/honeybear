<script lang="ts">
    import { Button } from "bits-ui";
    import MagnifyingGlass from "phosphor-svelte/lib/MagnifyingGlass";
    import FunnelSimple from "phosphor-svelte/lib/FunnelSimple";
    import UserPlus from "phosphor-svelte/lib/UserPlus";
    import SquaresFour from "phosphor-svelte/lib/SquaresFour";
    import Rows from "phosphor-svelte/lib/Rows";

    interface Props {
        searchTerm: string;
        statusFilter: string;
        viewMode: 'grid' | 'list';
        onSearchChange: (searchTerm: string) => void;
        onStatusChange: (status: string) => void;
        onViewModeChange: (viewMode: 'grid' | 'list') => void;
        onAddCustomer?: () => void;
    }

    let {
        searchTerm,
        statusFilter,
        viewMode,
        onSearchChange,
        onStatusChange,
        onViewModeChange,
        onAddCustomer
    }: Props = $props();

    const statuses = [
        { value: 'all', label: 'All Customers' },
        { value: 'active', label: 'Active' },
        { value: 'inactive', label: 'Inactive' }
    ];
</script>

<div class="bg-background-alt rounded-xl shadow-sm border border-border-card p-6 theme-transition">
    <div class="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <!-- Left side - Search and Filters -->
        <div class="flex flex-col sm:flex-row gap-4 flex-1 w-full sm:w-auto">
            <!-- Search Input -->
            <div class="relative flex-1 min-w-0">
                <MagnifyingGlass class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground theme-transition" />
                <input
                    type="text"
                    placeholder="Search customers by name or email..."
                    value={searchTerm}
                    oninput={(e) => onSearchChange(e.currentTarget.value)}
                    class="w-full pl-10 pr-4 py-2 border border-border-input rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent theme-transition"
                />
            </div>

            <!-- Status Filter -->
            <div class="relative">
                <FunnelSimple class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground theme-transition" />
                <select
                    value={statusFilter}
                    onchange={(e) => onStatusChange(e.currentTarget.value)}
                    class="pl-10 pr-8 py-2 border border-border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent theme-transition appearance-none min-w-[140px]"
                >
                    {#each statuses as status}
                        <option value={status.value}>{status.label}</option>
                    {/each}
                </select>
            </div>
        </div>

        <!-- Right side - View Toggle and Actions -->
        <div class="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
            <!-- View Mode Toggle -->
            <div class="flex items-center bg-muted rounded-lg p-1">
                <Button.Root
                    class="flex items-center justify-center w-8 h-8 rounded-md transition-all duration-200 {viewMode === 'grid' ? 'bg-accent text-accent-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}"
                    onclick={() => onViewModeChange('grid')}
                >
                    <SquaresFour class="w-4 h-4" />
                </Button.Root>
                <Button.Root
                    class="flex items-center justify-center w-8 h-8 rounded-md transition-all duration-200 {viewMode === 'list' ? 'bg-accent text-accent-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}"
                    onclick={() => onViewModeChange('list')}
                >
                    <Rows class="w-4 h-4" />
                </Button.Root>
            </div>

            <!-- Add Customer Button -->
            {#if onAddCustomer}
                <Button.Root
                    onclick={onAddCustomer}
                    class="bg-accent hover:bg-accent/90 text-accent-foreground px-4 py-2 rounded-lg flex items-center space-x-2 theme-transition-fast font-medium"
                >
                    <UserPlus class="w-4 h-4" />
                    <span class="hidden sm:inline">Add Customer</span>
                    <span class="sm:hidden">Add</span>
                </Button.Root>
            {/if}
        </div>
    </div>
</div>