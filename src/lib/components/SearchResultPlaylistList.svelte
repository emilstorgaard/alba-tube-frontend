<script lang="ts">
    import type { User } from '$lib/utils/types';
    import { API_BASE_URL } from '$lib/utils/config';
    import { showSearchResults } from '$lib/stores/searchStore';
	import { selectedUserStore } from '$lib/stores/userStore';
    export let users: User[] = [];
</script>

<div class="flex-1 overflow-y-auto mt-2 space-y-2">
    {#each users as user (user.id)}
    <div class="p-2 rounded-md flex items-center gap-4 justify-between hover:bg-gray hover:cursor-pointer transition">
        <img src={`${API_BASE_URL}/videos/thumbnail/${user.profileImageParh}`} alt="{user.username}" class="w-16 h-16 rounded-md object-cover" />
        <button title="Select User" on:click={() => { selectedUserStore.set(user); showSearchResults.set(false); }} class="text-left w-full">
            <p class="text-lg text-white font-medium line-clamp-1">{user.username}</p>
        </button>
    </div>
    {/each}
</div>