<script lang="ts">
    import User from "phosphor-svelte/lib/User";
    import Envelope from "phosphor-svelte/lib/Envelope";
    import Clock from "phosphor-svelte/lib/Clock";
    import CalendarBlank from "phosphor-svelte/lib/CalendarBlank";
    import CheckCircle from "phosphor-svelte/lib/CheckCircle";
    import PencilLine from "phosphor-svelte/lib/PencilLine";
    import StickyModeToggle from "$lib/components/sticky-mode-toggle.svelte";
    import { stickyModeStore } from "$lib/sticky-mode.svelte";

    let { data } = $props();

    // Format date helper
    function formatDate(dateString: string) {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    function formatDateShort(dateString: string) {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    }
</script>

<div class="flex flex-col h-full">
    <!-- Header -->
    <div class="{stickyModeStore.isSticky ? 'sticky top-0 bg-background/95 backdrop-blur-sm border-b border-border-card z-10' : ''} {stickyModeStore.isSticky ? 'pb-4' : 'pb-6'}">
        <!-- Page Header -->
        <div class="flex items-center justify-between">
            <div class="{stickyModeStore.isSticky ? 'space-y-1' : 'space-y-0'}">
                <div class="flex items-center space-x-3">
                    <h1 class="{stickyModeStore.isSticky ? 'text-xl' : 'text-2xl'} font-bold text-foreground">Profile</h1>
                    <StickyModeToggle size="sm" showLabel={false} />
                </div>
                {#if !stickyModeStore.isSticky}
                    <p class="text-foreground-alt">Manage your account information and preferences</p>
                {/if}
            </div>
            <button class="bg-accent hover:bg-accent/90 text-accent-foreground {stickyModeStore.isSticky ? 'px-3 py-1.5 text-sm' : 'px-4 py-2'} rounded-lg flex items-center space-x-2 theme-transition-fast">
                <PencilLine class="{stickyModeStore.isSticky ? 'w-3 h-3' : 'w-4 h-4'}" />
                <span>{stickyModeStore.isSticky ? 'Edit' : 'Edit Profile'}</span>
            </button>
        </div>
    </div>

    <!-- Scrollable Content -->
    <div class="flex-1 space-y-6">
        <!-- Profile Card -->
    <div class="bg-background-alt rounded-xl shadow-sm border border-border-card overflow-hidden theme-transition">
        <!-- Profile Header -->
        <div class="bg-gradient-to-r from-accent/10 to-accent/5 p-6 border-b border-border-card">
            <div class="flex items-start space-x-6">
                <!-- Avatar -->
                <div class="flex-shrink-0">
                    <div class="relative">
                        <img
                            src={data.activeUser.profilePictureUrl}
                            alt="{data.activeUser.firstName} {data.activeUser.lastName}"
                            class="w-24 h-24 rounded-full border-4 border-background shadow-lg object-cover"
                        />
                        {#if data.activeUser.emailVerified}
                            <div class="absolute -bottom-1 -right-1 bg-green-500 rounded-full p-1">
                                <CheckCircle class="w-4 h-4 text-white" weight="fill" />
                            </div>
                        {/if}
                    </div>
                </div>

                <!-- Basic Info -->
                <div class="flex-1 min-w-0">
                    <div class="flex items-center space-x-3 mb-2">
                        <h2 class="text-2xl font-bold text-foreground">
                            {data.activeUser.firstName} {data.activeUser.lastName}
                        </h2>
                        {#if data.activeUser.emailVerified}
                            <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 border border-green-200 dark:border-green-800">
                                <CheckCircle class="w-3 h-3 mr-1" weight="fill" />
                                Verified
                            </span>
                        {/if}
                    </div>

                    <div class="flex items-center space-x-2 text-foreground-alt mb-2">
                        <Envelope class="w-4 h-4" />
                        <span>{data.activeUser.email}</span>
                    </div>

                    <div class="text-sm text-foreground-alt">
                        User ID: <code class="bg-muted px-2 py-1 rounded text-xs font-mono">{data.activeUser.id}</code>
                    </div>
                </div>
            </div>
        </div>

        <!-- Account Details -->
        <div class="p-6">
            <h3 class="text-lg font-semibold text-foreground mb-4 flex items-center space-x-2">
                <User class="w-5 h-5" />
                <span>Account Details</span>
            </h3>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <!-- Personal Information -->
                <div class="space-y-4">
                    <h4 class="font-medium text-foreground text-sm uppercase tracking-wide">Personal Information</h4>

                    <div class="space-y-3">
                        <div class="flex justify-between items-center py-2 border-b border-border-card">
                            <span class="text-foreground-alt text-sm">First Name</span>
                            <span class="text-foreground font-medium">{data.activeUser.firstName}</span>
                        </div>

                        <div class="flex justify-between items-center py-2 border-b border-border-card">
                            <span class="text-foreground-alt text-sm">Last Name</span>
                            <span class="text-foreground font-medium">{data.activeUser.lastName}</span>
                        </div>

                        <div class="flex justify-between items-center py-2 border-b border-border-card">
                            <span class="text-foreground-alt text-sm">Email Address</span>
                            <div class="flex items-center space-x-2">
                                <span class="text-foreground font-medium">{data.activeUser.email}</span>
                                {#if data.activeUser.emailVerified}
                                    <CheckCircle class="w-4 h-4 text-green-500" weight="fill" />
                                {/if}
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Account Information -->
                <div class="space-y-4">
                    <h4 class="font-medium text-foreground text-sm uppercase tracking-wide">Account Information</h4>

                    <div class="space-y-3">
                        <div class="flex justify-between items-center py-2 border-b border-border-card">
                            <span class="text-foreground-alt text-sm flex items-center space-x-2">
                                <CalendarBlank class="w-4 h-4" />
                                <span>Member Since</span>
                            </span>
                            <span class="text-foreground font-medium">{formatDateShort(data.activeUser.createdAt)}</span>
                        </div>

                        <div class="flex justify-between items-center py-2 border-b border-border-card">
                            <span class="text-foreground-alt text-sm flex items-center space-x-2">
                                <Clock class="w-4 h-4" />
                                <span>Last Sign In</span>
                            </span>
                            <span class="text-foreground font-medium">{formatDate(data.activeUser.lastSignInAt)}</span>
                        </div>

                        <div class="flex justify-between items-center py-2 border-b border-border-card">
                            <span class="text-foreground-alt text-sm">Last Updated</span>
                            <span class="text-foreground font-medium">{formatDate(data.activeUser.updatedAt)}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Account Status -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Verification Status -->
        <div class="bg-background-alt rounded-xl shadow-sm border border-border-card p-6 theme-transition">
            <h3 class="text-lg font-semibold text-foreground mb-4 flex items-center space-x-2">
                <CheckCircle class="w-5 h-5 text-green-500" />
                <span>Verification Status</span>
            </h3>

            <div class="space-y-3">
                <div class="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-lg">
                    <div class="flex items-center space-x-3">
                        <CheckCircle class="w-5 h-5 text-green-500" weight="fill" />
                        <div>
                            <p class="text-sm font-medium text-green-800 dark:text-green-400">Email Verified</p>
                            <p class="text-xs text-green-600 dark:text-green-500">Your email address has been confirmed</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Account Type -->
        <div class="bg-background-alt rounded-xl shadow-sm border border-border-card p-6 theme-transition">
            <h3 class="text-lg font-semibold text-foreground mb-4 flex items-center space-x-2">
                <User class="w-5 h-5 text-accent" />
                <span>Account Type</span>
            </h3>

            <div class="space-y-3">
                <div class="flex items-center justify-between p-3 bg-accent/10 border border-accent/20 rounded-lg">
                    <div class="flex items-center space-x-3">
                        <User class="w-5 h-5 text-accent" />
                        <div>
                            <p class="text-sm font-medium text-foreground">Standard User</p>
                            <p class="text-xs text-foreground-alt">Full access to all features</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Debug Info (for development) -->
    {#if process.env.NODE_ENV === 'development'}
        <details class="bg-muted rounded-lg p-4 theme-transition">
            <summary class="cursor-pointer text-sm font-medium text-foreground-alt">Debug Information</summary>
            <pre class="mt-4 text-xs text-foreground-alt overflow-auto">{JSON.stringify(data.activeUser, null, 2)}</pre>
        </details>
    {/if}
    </div>
</div>