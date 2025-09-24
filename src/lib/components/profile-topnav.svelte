<script lang="ts">
    import { Avatar, DropdownMenu } from "bits-ui";
    import Cardholder from "phosphor-svelte/lib/Cardholder";
    import CaretRight from "phosphor-svelte/lib/CaretRight";
    import DotsThree from "phosphor-svelte/lib/DotsThree";
    import GearSix from "phosphor-svelte/lib/GearSix";
    import UserCircle from "phosphor-svelte/lib/UserCircle";
    import UserCirclePlus from "phosphor-svelte/lib/UserCirclePlus";
    import Bell from "phosphor-svelte/lib/Bell";
    import Check from "phosphor-svelte/lib/Check";
    import DotOutline from "phosphor-svelte/lib/DotOutline";
    import SignOut from "phosphor-svelte/lib/SignOut";
    import type {User} from "@workos-inc/node";

    let notifications = $state<boolean>(false);
    let invited = $state("");

    let { activeUser }: {activeUser: User} = $props();
    
    let avatar = $derived(activeUser.profilePictureUrl ?? 'https://ui-avatars.com/api/?name=John+Doe&background=0D8ABC&color=fff');
</script>

<DropdownMenu.Root>
    <DropdownMenu.Trigger
            class="border-input text-foreground shadow-btn hover:bg-muted inline-flex h-10 w-10 select-none items-center justify-center text-sm font-medium active:scale-[0.98]"
    >
        <Avatar.Root
                delayMs={200}
                class="data-[status=loaded]:border-foreground bg-muted text-muted-foreground h-12 w-12 rounded-full border text-[17px] font-medium uppercase data-[status=loading]:border-transparent"
        >
            <div
                    class="flex h-full w-full items-center justify-center overflow-hidden rounded-full border-2 border-transparent"
            >
                <Avatar.Image src={avatar} />
                <Avatar.Fallback class="border-muted border">HB</Avatar.Fallback>
            </div>
        </Avatar.Root>
    </DropdownMenu.Trigger>
    <DropdownMenu.Portal>
        <DropdownMenu.Content
                class="border-muted bg-background shadow-popover outline-hidden focus-visible:outline-hidden w-[229px] rounded-xl border px-1 py-1.5"
                sideOffset={8}
        >
            <DropdownMenu.Item
                    class="rounded-button data-highlighted:bg-muted ring-0! ring-transparent! flex h-10 select-none items-center py-3 pl-3 pr-1.5 text-sm font-medium focus-visible:outline-none"
            >
                <a href="/profile" class="flex items-center">
                    <div class="flex items-center">
                        <UserCircle class="text-foreground-alt mr-2 size-5" />
                        Profile
                    </div>
                </a>
                

            </DropdownMenu.Item>
            <DropdownMenu.Item
                    class="rounded-button data-highlighted:bg-muted ring-0! ring-transparent! flex h-10 select-none items-center py-3 pl-3 pr-1.5 text-sm font-medium focus-visible:outline-none"
            >
                <a href="/logout" class="flex items-center">
                    <div class="flex items-center">
                        <SignOut class="text-foreground-alt mr-2 size-5" />
                        Logout
                    </div>
                </a>
                
            </DropdownMenu.Item>
        </DropdownMenu.Content>
    </DropdownMenu.Portal>
</DropdownMenu.Root>