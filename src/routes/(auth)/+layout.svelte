<script lang="ts">
    import Sidebar from '$lib/components/sidebar.svelte';
    import Header from '$lib/components/header.svelte';
    import {page} from '$app/state';
    import HouseSimple from "phosphor-svelte/lib/HouseSimple";
    import Package from "phosphor-svelte/lib/Package";
    import ShoppingCartSimple from "phosphor-svelte/lib/ShoppingCartSimple";
    import UserSquare from "phosphor-svelte/lib/UserSquare";
    import {fly} from 'svelte/transition'

    let {children, data} = $props();

    const menuItems: Client.MenuItem[] = [
        {id: 'dashboard', label: 'Dashboard', icon: HouseSimple, path: "/"},
        {id: 'products', label: 'Products', icon: Package, path: "/products"},
        {id: 'orders', label: 'Orders', icon: ShoppingCartSimple, path: "/orders"},
        {id: 'customers', label: 'Customers', icon: UserSquare, path: "/customers"},
        // { id: 'analytics', label: 'Analytics', icon: BarChart3, path: "/"  },
        // { id: 'categories', label: 'Categories', icon: Tag, path: "/"  },
        // { id: 'settings', label: 'Settings', icon: Settings, path: "/"  }
    ];

    let currentSection = $derived.by(() => {
        const pathName = page.url.pathname;
        let section: string;

        // Handle root path
        if (pathName === '/') {
            section = 'dashboard';
        } else {
            // For paths like /products/123, we want "products"
            // For paths like /products, we want "products"
            const pathSegments = pathName.split('/').filter(segment => segment !== '');
            section = pathSegments[0] || 'dashboard';
        }

        return menuItems.find(m => m.id === section) ?? menuItems[0];
    });
    
    let sidebarOpen = $state(false);

    let header = $derived.by(() => {
        return {
            title: currentSection.label,
            onMenuClick: () => {
            }
        }
    });

</script>

<svelte:head>
</svelte:head>

<div class="min-h-screen bg-gray-50 dark:bg-primary-950 lg:flex">
    <!--    <Navbar logoutLink="/logout" activeUser={data.activeUser}/>-->
    {#if data.activeUser}
        <Sidebar activeUser={data.activeUser} bind:activeSection={currentSection} menuItems={menuItems} bind:sidebarOpen={sidebarOpen}/>
        <div class="flex-grow bg-primary-50 dark:bg-primary-950">
            <Header activeUser={data.activeUser} header={header}/>
            {#key data.url}
                <main
                        in:fly={{ x: -200, duration: 100, }}
                        class="flex-1 p-4 lg:p-6 mx-auto container">
                    {@render children?.()}
                </main>
            {/key}
        </div>
    {/if}
    
</div>

