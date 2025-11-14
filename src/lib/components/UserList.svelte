<script lang="ts">
    import { usersStore, selectedUserStore } from '$lib/stores/userStore';
	import { fetchSubscriptions } from '$lib/utils/user';
	import { onMount } from 'svelte';
    import { API_BASE_URL } from '$lib/utils/config';

    onMount(() => {
        fetchSubscriptions();
    });

</script>

<div class="flex-1 overflow-y-auto mt-2 space-y-2">
  {#each $usersStore as user}
    <button 
      type="button"
      title="Vælg kanal"
      class="p-2 w-full rounded-md flex items-center gap-4 justify-between hover:bg-gray hover:cursor-pointer transition outline-none"
      on:click={() => selectedUserStore.set(user)}
    >
      <!-- Profilbillede -->
      <img
        src={`${API_BASE_URL}/videos/thumbnail/${user.profileImageParh}`}
        alt="Profilbillede"
        class="w-10 h-10 rounded-full object-cover border border-gray"
      />

      <!-- Brugernavn -->
      <p class="text-lg text-white font-medium line-clamp-1">{user.username}</p>
    </button>
  {/each}
</div>

