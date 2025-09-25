<script lang="ts">
    import { Avatar, DropdownMenu } from "bits-ui";
    import HouseSimple from "phosphor-svelte/lib/HouseSimple";
    import Package from "phosphor-svelte/lib/Package";
    import ShoppingCartSimple from "phosphor-svelte/lib/ShoppingCartSimple";
    import UserSquare  from "phosphor-svelte/lib/UserSquare";
    import type {User} from "@workos-inc/node";

    interface SidebarProps {
        activeUser: User, 
        activeSection: Client.MenuItem, 
        menuItems : Client.MenuItem[],
        sidebarOpen: boolean,
    }


    let { activeUser, activeSection=$bindable(), menuItems, sidebarOpen=$bindable() }: SidebarProps = $props();

</script>

<div class="fixed lg:relative inset-y-0 left-0 z-50 w-64 bg-background shadow-lg transform transition-transform duration-300 ease-in-out lg:transform-none theme-transition h-full flex flex-col {sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}">
    <div class="lg:hidden absolute top-4 right-4">
        <button
                onclick={()=> {sidebarOpen = false}}
class="p-2 text-muted-foreground hover:text-foreground theme-transition-fast">
            close
        </button>
    </div>

<div class="p-6 border-b border-border-card theme-transition">
        <div class="flex items-center space-x-2">
            <div class="w-8 h-8 bg-accent rounded-lg flex items-center justify-center theme-transition">
                <Package class="w-5 h-5 text-accent-foreground theme-transition" />
            </div>
<h1 class="text-xl font-bold text-foreground theme-transition">ShopAdmin</h1>
        </div>
    </div>

    <nav class="flex-1 overflow-y-auto mt-6">
        {#each menuItems as item}
            <a
                href={item.path}
class="w-full flex items-center space-x-3 px-6 py-3 text-left theme-transition-fast {item.id === activeSection.id ? 'bg-muted text-foreground' : 'text-muted-foreground hover:bg-background-alt hover:text-foreground'}"
            >
                <item.icon class="w-5 h-5" />
                <span class="font-medium">{item.label}</span>
            </a>
        {/each}
    </nav>
</div>