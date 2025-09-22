<script lang="ts">
    import ProfileNav from "./profile-topnav.svelte";
    import List from "phosphor-svelte/lib/List";
    import MagnifyingGlass from "phosphor-svelte/lib/MagnifyingGlass";
    import Bell from "phosphor-svelte/lib/Bell";
    import UserSquare  from "phosphor-svelte/lib/UserSquare";
    import Moon from "phosphor-svelte/lib/Moon";
    import Sun from "phosphor-svelte/lib/Sun";
    import type {User} from "@workos-inc/node";
    import { themeStore } from "$lib/theme.svelte";

    interface HeaderProps {
        title: string;
        onMenuClick: () => void;
    }


    let { activeUser, header = $bindable() }: {activeUser: User, header: HeaderProps} = $props();
</script>

<header class="bg-background shadow-sm border-b border-border-card px-6 py-4">
    <div class="flex items-center justify-between md:pr-12">
        <div class="flex items-center space-x-4">
            <button
                    onclick={header.onMenuClick}
                    class="lg:hidden p-2 text-muted-foreground hover:text-foreground transition-colors"
            >
                <List class="w-5 h-5" />
            </button>

            <div>
<h2 class="text-2xl font-bold text-foreground capitalize">{header.title}</h2>
<p class="text-sm text-foreground-alt mt-1 hidden sm:block">
                    {new Date().toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                    })}
                </p>
            </div>
        </div>

        <div class="flex items-center space-x-4">
            <div class="relative hidden md:block">
<MagnifyingGlass class="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <input
                        type="text"
                        placeholder="Search..."
class="pl-10 pr-4 py-2 border border-border-input bg-background-alt text-foreground placeholder:text-muted-foreground rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent w-64"
                />
            </div>

            <button
                onclick={themeStore.toggleTheme}
class="p-2 text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Toggle theme"
            >
                {#if themeStore.current === 'light'}
                    <Moon class="w-5 h-5" />
                {:else}
                    <Sun class="w-5 h-5" />
                {/if}
            </button>

<button class="relative p-2 text-muted-foreground hover:text-foreground transition-colors">
                <Bell class="w-5 h-5" />
                <span class="absolute top-0 right-0 w-2 h-2 bg-destructive rounded-full"></span>
            </button>

            <div class="flex items-center space-x-2">
                <ProfileNav activeUser={activeUser} />
            </div>
        </div>
    </div>
</header>