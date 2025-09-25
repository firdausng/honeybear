<script lang="ts">
    import { Avatar } from "bits-ui";
    import Envelope from "phosphor-svelte/lib/Envelope";
    import Phone from "phosphor-svelte/lib/Phone";
    import MapPin from "phosphor-svelte/lib/MapPin";
    import ShoppingCart from "phosphor-svelte/lib/ShoppingCart";
    import CurrencyDollar from "phosphor-svelte/lib/CurrencyDollar";
    import PencilLine from "phosphor-svelte/lib/PencilLine";
    import Eye from "phosphor-svelte/lib/Eye";
    import CalendarBlank from "phosphor-svelte/lib/CalendarBlank";

    interface Props {
        customers: Client.Customer[];
        getStatusColor: (status: string) => string;
        onEditCustomer?: (customer: Client.Customer) => void;
        onViewCustomer?: (customer: Client.Customer) => void;
    }

    let {
        customers,
        getStatusColor,
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

<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {#each customers as customer}
        <div class="bg-background-alt rounded-xl shadow-sm border border-border-card overflow-hidden hover:shadow-md theme-transition group">
            <!-- Customer Header -->
            <div class="p-6 pb-4">
                <div class="flex items-center space-x-4 mb-4">
                    <Avatar.Root class="h-12 w-12 rounded-full overflow-hidden border-2 border-background shadow-sm theme-transition">
                        <Avatar.Image
                            src={getAvatarUrl(customer)}
                            alt={customer.name}
                            class="h-full w-full object-cover"
                        />
                        <Avatar.Fallback class="h-full w-full bg-accent text-accent-foreground text-sm font-medium flex items-center justify-center">
                            {getInitials(customer.name)}
                        </Avatar.Fallback>
                    </Avatar.Root>

                    <div class="flex-1 min-w-0">
                        <h3 class="text-lg font-semibold text-foreground truncate">{customer.name}</h3>
                        <p class="text-sm text-foreground-alt">ID: {customer.id}</p>
                        <span class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium {getStatusColor(customer.status)} theme-transition mt-1">
                            {customer.status === 'active' ? 'Active' : 'Inactive'}
                        </span>
                    </div>
                </div>
            </div>

            <!-- Customer Details -->
            <div class="px-6 pb-4 space-y-3">
                <!-- Contact Info -->
                <div class="space-y-2">
                    <div class="flex items-center space-x-2 text-sm text-foreground">
                        <Envelope class="w-4 h-4 text-foreground-alt flex-shrink-0" />
                        <span class="truncate">{customer.email}</span>
                    </div>
                    {#if customer.phone}
                        <div class="flex items-center space-x-2 text-sm text-foreground-alt">
                            <Phone class="w-4 h-4 flex-shrink-0" />
                            <span>{customer.phone}</span>
                        </div>
                    {/if}
                </div>

                <!-- Location -->
                {#if customer.shippingAddress}
                    <div class="flex items-center space-x-2 text-sm text-foreground-alt">
                        <MapPin class="w-4 h-4 flex-shrink-0" />
                        <span class="truncate">{customer.shippingAddress.city}, {customer.shippingAddress.state}</span>
                    </div>
                {/if}

                <!-- Stats -->
                <div class="grid grid-cols-2 gap-4 pt-3 border-t border-border-card">
                    <div class="text-center">
                        <div class="flex items-center justify-center space-x-1 text-sm text-foreground mb-1">
                            <ShoppingCart class="w-4 h-4 text-foreground-alt" />
                            <span class="font-semibold">{customer.totalOrders}</span>
                        </div>
                        <p class="text-xs text-foreground-alt">Orders</p>
                    </div>

                    <div class="text-center">
                        <div class="flex items-center justify-center space-x-1 text-sm text-foreground mb-1">
                            <CurrencyDollar class="w-4 h-4 text-foreground-alt" />
                            <span class="font-semibold">{formatCurrency(customer.totalSpent)}</span>
                        </div>
                        <p class="text-xs text-foreground-alt">Total Spent</p>
                    </div>
                </div>

                <!-- Dates -->
                <div class="pt-3 border-t border-border-card space-y-2 text-xs text-foreground-alt">
                    <div class="flex items-center space-x-2">
                        <CalendarBlank class="w-3 h-3" />
                        <span>Joined: {formatDate(customer.createdAt)}</span>
                    </div>
                    {#if customer.lastOrderDate}
                        <div class="flex items-center space-x-2">
                            <ShoppingCart class="w-3 h-3" />
                            <span>Last Order: {formatDate(customer.lastOrderDate)}</span>
                        </div>
                    {/if}
                </div>
            </div>

            <!-- Actions -->
            <div class="flex items-center p-4 bg-muted/20 border-t border-border-card gap-2 opacity-60 group-hover:opacity-100 theme-transition">
                {#if onViewCustomer}
                    <button
                        onclick={() => onViewCustomer?.(customer)}
                        class="flex-1 bg-background hover:bg-muted text-foreground px-3 py-2 rounded-lg text-xs font-medium theme-transition-fast flex items-center justify-center space-x-1"
                    >
                        <Eye class="w-4 h-4" />
                        <span>View</span>
                    </button>
                {/if}
                {#if onEditCustomer}
                    <button
                        onclick={() => onEditCustomer?.(customer)}
                        class="flex-1 bg-accent hover:bg-accent/90 text-accent-foreground px-3 py-2 rounded-lg text-xs font-medium theme-transition-fast flex items-center justify-center space-x-1"
                    >
                        <PencilLine class="w-4 h-4" />
                        <span>Edit</span>
                    </button>
                {/if}
            </div>
        </div>
    {/each}
</div>