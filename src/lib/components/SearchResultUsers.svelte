<script lang="ts">
    import type { User } from '$lib/utils/types';
    import { API_BASE_URL } from '$lib/utils/config';
    import { showSearchResults } from '$lib/stores/searchStore';
    export let users: User[] = [];
</script>

<div class="flex-1 overflow-y-auto mt-2 space-y-2">
    {#each users as user (user.id)}
        <div class="p-2 rounded-md flex items-center gap-4 justify-between relative group hover:bg-gray hover:cursor-pointer transition border-b border-gray">
                                   <a
                    href={`/user/${user.id}`}
                    class="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-white rounded-lg opacity-0 group-hover:opacity-100 transition"
                    on:click={(e) => {
                        showSearchResults.set(false);
                        // optionally, allow normal navigation:
                        // e.stopPropagation(); // use this only if you prevent default
                    }}
                ></a>
        
            <div class="relative w-16 h-16 shrink-0">
                <img 
                    src={`${API_BASE_URL}/videos/thumbnail/${user.profileImageParh}`} 
                    alt={user.username} 
                    class="w-full h-full rounded-lg object-cover transition-opacity duration-300 group-hover:opacity-60"
                />
            </div>

            <div class="text-left w-full">
                <div>
                    <h3 class="text-lg font-semibold text-white">{user.username}</h3>
                </div>
            </div>

    </div>
    {/each}
</div>