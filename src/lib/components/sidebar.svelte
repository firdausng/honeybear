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

<div class="fixed lg:static inset-y-0 left-0 z-50 w-64 bg-primary-50 dark:bg-primary-950 shadow-lg transform transition-transform duration-300 ease-in-out lg:transform-none">
    <div class="lg:hidden absolute top-4 right-4">
        <button
                onclick={()=> {sidebarOpen = false}}
class="p-2 text-primary-400 hover:text-primary-600 dark:text-primary-200 dark:hover:text-primary-100 transition-colors">
            close
        </button>
    </div>

<div class="p-6 border-b border-primary-200 dark:border-primary-800">
        <div class="flex items-center space-x-2">
            <div class="w-8 h-8 bg-primary-900 dark:bg-primary-600 rounded-lg flex items-center justify-center">
                <Package class="w-5 h-5 text-primary-100 dark:text-primary-100" />
            </div>
<h1 class="text-xl font-bold text-primary-900 dark:text-primary-50">ShopAdmin</h1>
        </div>
    </div>
    
    <nav class="mt-6">
        {#each menuItems as item}
            <a
                href={item.path}
class="w-full flex items-center space-x-3 px-6 py-3 text-left transition-colors {item.id === activeSection.id ? 'bg-primary-100 dark:bg-primary-800 text-primary-900 dark:text-primary-50' : 'text-primary-600 dark:text-primary-200 hover:bg-primary-50 dark:hover:bg-primary-900'}"
            >
                <item.icon class="w-5 h-5" />
                <span class="font-medium">{item.label}</span>
            </a>
        {/each}
    </nav>
</div>