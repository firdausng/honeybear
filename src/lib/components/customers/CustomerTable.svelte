<script lang="ts">
    import { Avatar } from "bits-ui";
    import Envelope from "phosphor-svelte/lib/Envelope";
    import Phone from "phosphor-svelte/lib/Phone";
    import MapPin from "phosphor-svelte/lib/MapPin";
    import ShoppingCart from "phosphor-svelte/lib/ShoppingCart";
    import CurrencyDollar from "phosphor-svelte/lib/CurrencyDollar";
    import PencilLine from "phosphor-svelte/lib/PencilLine";
    import DotsThreeVertical from "phosphor-svelte/lib/DotsThreeVertical";

    interface Props {
        customers: Client.Customer[];
        selectedCustomerIds?: Set<string>;
        isAllSelected?: boolean;
        isIndeterminate?: boolean;
        getStatusColor: (status: string) => string;
        onToggleSelectAll?: () => void;
        onToggleCustomerSelection?: (customerId: string) => void;
        onEditCustomer?: (customer: Client.Customer) => void;
        onViewCustomer?: (customer: Client.Customer) => void;
    }

    let {
        customers,
        selectedCustomerIds,
        isAllSelected = false,
        isIndeterminate = false,
        getStatusColor,
        onToggleSelectAll,
        onToggleCustomerSelection,
        onEditCustomer,
        onViewCustomer
    }: Props = $props();

    // Format date helper
    function formatDate(dateString: string) {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    }

    // Format currency helper
    function formatCurrency(amount: number) {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount);
    }

    // Generate avatar URL
    function getAvatarUrl(customer: Client.Customer) {
        return `https://ui-avatars.com/api/?name=${encodeURIComponent(customer.name)}&background=0D8ABC&color=fff`;
    }

    // Get initials
    function getInitials(name: string) {
        return name.split(' ').map(n => n.charAt(0)).join('').toUpperCase();
    }
</script>

<div class="bg-background-alt rounded-xl shadow-sm border border-border-card overflow-hidden theme-transition">
    <!-- Table Header -->
    <div class="bg-muted/30 px-6 py-4 border-b border-border-card">
        <h3 class="text-lg font-semibold text-foreground flex items-center space-x-2">
            <span>Customers ({customers.length})</span>
        </h3>
    </div>

    <!-- Table Content -->
    <div class="overflow-x-auto">
        <table class="w-full">
            <!-- Table Head -->
            <thead class="bg-muted/20 border-b border-border-card">
                <tr>
                    {#if onToggleSelectAll && onToggleCustomerSelection}
                        <th class="w-12 px-6 py-4 text-left">
                            <input
                                type="checkbox"
                                checked={isAllSelected}
                                indeterminate={isIndeterminate}
                                onchange={onToggleSelectAll}
                                class="w-4 h-4 text-accent bg-background border-border-input rounded focus:ring-accent focus:ring-2 theme-transition"
                            />
                        </th>
                    {/if}
                    <th class="px-6 py-4 text-left text-xs font-medium text-foreground-alt uppercase tracking-wider">Customer</th>
                    <th class="px-6 py-4 text-left text-xs font-medium text-foreground-alt uppercase tracking-wider">Contact</th>
                    <th class="px-6 py-4 text-left text-xs font-medium text-foreground-alt uppercase tracking-wider">Location</th>
                    <th class="px-6 py-4 text-left text-xs font-medium text-foreground-alt uppercase tracking-wider">Orders</th>
                    <th class="px-6 py-4 text-left text-xs font-medium text-foreground-alt uppercase tracking-wider">Total Spent</th>
                    <th class="px-6 py-4 text-left text-xs font-medium text-foreground-alt uppercase tracking-wider">Status</th>
                    <th class="px-6 py-4 text-left text-xs font-medium text-foreground-alt uppercase tracking-wider">Joined</th>
                    <th class="px-6 py-4 text-right text-xs font-medium text-foreground-alt uppercase tracking-wider">Actions</th>
                </tr>
            </thead>

            <!-- Table Body -->
            <tbody class="bg-background divide-y divide-border-card">
                {#each customers as customer}
                    <tr class="hover:bg-muted/20 theme-transition group">
                        {#if onToggleCustomerSelection}
                            <td class="px-6 py-4 whitespace-nowrap">
                                <input
                                    type="checkbox"
                                    checked={selectedCustomerIds?.has(customer.id) || false}
                                    onchange={() => onToggleCustomerSelection?.(customer.id)}
                                    class="w-4 h-4 text-accent bg-background border-border-input rounded focus:ring-accent focus:ring-2 theme-transition"
                                />
                            </td>
                        {/if}

                        <!-- Customer Info -->
                        <td class="px-6 py-4 whitespace-nowrap">
                            <div class="flex items-center space-x-3">
                                <Avatar.Root class="h-10 w-10 rounded-full overflow-hidden border-2 border-background shadow-sm theme-transition">
                                    <Avatar.Image
                                        src={getAvatarUrl(customer)}
                                        alt={customer.name}
                                        class="h-full w-full object-cover"
                                    />
                                    <Avatar.Fallback class="h-full w-full bg-accent text-accent-foreground text-sm font-medium flex items-center justify-center">
                                        {getInitials(customer.name)}
                                    </Avatar.Fallback>
                                </Avatar.Root>
                                <div class="min-w-0">
                                    <p class="text-sm font-medium text-foreground truncate">{customer.name}</p>
                                    <p class="text-xs text-foreground-alt">ID: {customer.id}</p>
                                </div>
                            </div>
                        </td>

                        <!-- Contact Info -->
                        <td class="px-6 py-4 whitespace-nowrap">
                            <div class="space-y-1">
                                <div class="flex items-center space-x-2 text-sm text-foreground">
                                    <Envelope class="w-3 h-3 text-foreground-alt" />
                                    <span class="truncate">{customer.email}</span>
                                </div>
                                {#if customer.phone}
                                    <div class="flex items-center space-x-2 text-sm text-foreground-alt">
                                        <Phone class="w-3 h-3" />
                                        <span>{customer.phone}</span>
                                    </div>
                                {/if}
                            </div>
                        </td>

                        <!-- Location -->
                        <td class="px-6 py-4 whitespace-nowrap">
                            {#if customer.shippingAddress}
                                <div class="flex items-center space-x-2 text-sm text-foreground">
                                    <MapPin class="w-3 h-3 text-foreground-alt" />
                                    <span>{customer.shippingAddress.city}, {customer.shippingAddress.state}</span>
                                </div>
                            {:else}
                                <span class="text-sm text-foreground-alt">No address</span>
                            {/if}
                        </td>

                        <!-- Orders -->
                        <td class="px-6 py-4 whitespace-nowrap">
                            <div class="flex items-center space-x-2 text-sm text-foreground">
                                <ShoppingCart class="w-3 h-3 text-foreground-alt" />
                                <span>{customer.totalOrders}</span>
                            </div>
                            {#if customer.lastOrderDate}
                                <p class="text-xs text-foreground-alt">Last: {formatDate(customer.lastOrderDate)}</p>
                            {/if}
                        </td>

                        <!-- Total Spent -->
                        <td class="px-6 py-4 whitespace-nowrap">
                            <div class="flex items-center space-x-2 text-sm font-medium text-foreground">
                                <CurrencyDollar class="w-3 h-3 text-foreground-alt" />
                                <span>{formatCurrency(customer.totalSpent)}</span>
                            </div>
                        </td>

                        <!-- Status -->
                        <td class="px-6 py-4 whitespace-nowrap">
                            <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium {getStatusColor(customer.status)} theme-transition">
                                {customer.status === 'active' ? 'Active' : 'Inactive'}
                            </span>
                        </td>

                        <!-- Joined Date -->
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-foreground-alt">
                            {formatDate(customer.createdAt)}
                        </td>

                        <!-- Actions -->
                        <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div class="flex items-center justify-end space-x-2 opacity-60 group-hover:opacity-100 theme-transition">
                                {#if onViewCustomer}
                                    <button
                                        onclick={() => onViewCustomer?.(customer)}
                                        class="flex-1 bg-background-alt hover:bg-muted text-foreground px-3 py-2 rounded-lg text-xs font-medium theme-transition-fast flex items-center justify-center space-x-1"
                                        title="View Customer"
                                    >
                                        <span>View</span>
                                    </button>
                                {/if}
                                {#if onEditCustomer}
                                    <button
                                        onclick={() => onEditCustomer?.(customer)}
                                        class="flex-1 bg-background-alt hover:bg-accent text-accent-foreground px-3 py-2 rounded-lg text-xs font-medium theme-transition-fast flex items-center justify-center space-x-1"
                                        title="Edit Customer"
                                    >
                                        <PencilLine class="w-4 h-4" />
                                        <span>Edit</span>
                                    </button>
                                {/if}
                                <button
                                    class="p-2 text-foreground-alt hover:text-foreground hover:bg-muted rounded-lg theme-transition-fast"
                                    title="More actions"
                                >
                                    <DotsThreeVertical class="w-4 h-4" />
                                </button>
                            </div>
                        </td>
                    </tr>
                {/each}
            </tbody>
        </table>
    </div>
</div>