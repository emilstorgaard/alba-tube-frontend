<script lang="ts">
	import { usersStore } from '$lib/stores/userStore';
	import { fetchSubscriptions } from '$lib/utils/user';
	import { onMount } from 'svelte';
	import { API_BASE_URL } from '$lib/utils/config';

	onMount(() => {
		fetchSubscriptions();
	});
</script>

<div class="flex-1 overflow-y-auto mt-2 space-y-4">
	{#each $usersStore as user}
		<a
			href={`/user/${user.id}`}
			class="flex items-center space-x-3 hover:bg-gray-800 p-2 rounded-xl transition"
		>
			<!-- Profilbillede -->
			<img
				src={`${API_BASE_URL}/videos/thumbnail/${user.profileImageParh}`}
				alt="Profilbillede"
				class="w-12 h-12 rounded-full object-cover border border-gray-700 shadow"
			/>

			<!-- Brugernavn -->
			<p class="text-lg text-white font-semibold line-clamp-1">{user.username}</p>
		</a>
	{/each}
</div>
