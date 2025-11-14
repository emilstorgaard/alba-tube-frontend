<script lang="ts">
	import { userStore } from '$lib/stores/auth';
	import { API_BASE_URL } from '$lib/utils/config';
	import UserList from '$lib/components/UserList.svelte';
	import { selectedUserStore } from '$lib/stores/userStore';
	import VideoList from '$lib/components/VideoList.svelte';
	import { onMount } from 'svelte';
	import { fetchPopularVideos } from '$lib/utils/videos';
	import { fetchUser, subscribeToUser, unsubscribeFromUser } from '$lib/utils/user';

	onMount(async () => {
		if (!$selectedUserStore) {
			try {
				await fetchPopularVideos();
			} catch (e) {
				console.error('Failed to load popular videos:', e);
			}
		}
	});

	async function toggleSubscribe() {
		try {
			if ($selectedUserStore == null) return;
			if ($selectedUserStore?.isSubscribed) {
				await unsubscribeFromUser($selectedUserStore.id);
			} else {
				await subscribeToUser($selectedUserStore?.id);
			}

			// Opdater abonnementsstatus i selectedUserStore
			await fetchUser($selectedUserStore.id);
		} catch (e) {
			console.error('Failed to toggle subscription:', e);
		}
	}
</script>

<div class="flex-grow flex flex-col lg:flex-row gap-4 px-4 py-4 min-h-[80vh]">
	{#if $userStore}
		<div class="lg:w-1/4 w-full flex flex-col gap-4 lg:h-[80vh]">
			<!-- Profil boks -->
			<div
				class="flex flex-col bg-dark-gray rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow duration-200"
			>
				<button
					type="button"
					title="Gå til profil"
					class="flex items-center gap-4 w-full text-left focus:outline-none"
					on:click={() => selectedUserStore.set($userStore.user)}
				>
					<img
						src={`${API_BASE_URL}/videos/thumbnail/${$userStore.user.profileImageParh}`}
						alt="Profilbillede"
						class="w-16 h-16 rounded-full object-cover border-2 border-gray-600"
					/>
					<div class="flex flex-col justify-center">
						<h2 class="text-lg font-semibold text-white truncate">{$userStore.user.username}</h2>
						<p class="text-sm text-white mt-1">{$userStore.user.subscriberCount} abonnenter</p>
					</div>
				</button>
			</div>

			<!-- Abonnenter boks -->
			<div
				class="flex flex-col bg-dark-gray rounded-lg shadow-lg p-4 overflow-y-auto flex-1 lg:h-auto"
			>
				<div class="flex justify-between items-center mb-4 pb-2 border-b border-gray">
					<h2 class="text-xl font-semibold text-white">Abonnenter</h2>
				</div>
				<UserList />
			</div>
		</div>
	{/if}

	<!-- Video boks -->
<div
    class={`flex flex-col bg-dark-gray rounded-lg shadow-lg p-4 overflow-y-auto
        lg:h-[80vh] scrollbar-thin scrollbar-thumb-gray scrollbar-track-dark-gray
        ${$userStore ? 'lg:w-3/4 w-full' : 'w-full lg:w-full'}
    `}
>
    {#if $selectedUserStore}
        <div class="flex items-center gap-4 mb-4 pb-2 border-b border-gray">
            <img
                src={`${API_BASE_URL}/videos/thumbnail/${$selectedUserStore?.profileImageParh}`}
                alt="Profilbillede"
                class="w-16 h-16 rounded-full object-cover border-2 border-gray"
            />

            <div class="flex flex-col">
                <h2 class="text-xl font-semibold text-white">
                    {$selectedUserStore?.username}
                </h2>

                <p class="text-sm text-white">
                    {$selectedUserStore?.subscriberCount} abonnenter
                </p>

                {#if $userStore && $userStore.user.id !== $selectedUserStore?.id}
                    <button
                        class={`px-4 py-2 rounded-lg font-medium mt-2 transition-colors duration-200
                            ${
                                $selectedUserStore.isSubscribed
                                    ? 'bg-white text-gray-800 border border-gray-300 hover:bg-gray-100'
                                    : 'bg-red-600 hover:bg-red-700 text-white'
                            }
                        `}
                        on:click={toggleSubscribe}
                    >
                        {$selectedUserStore.isSubscribed ? 'Afmeld' : 'Abonnér'}
                    </button>
                {/if}
            </div>
        </div>
    {:else}
        <div class="flex items-center gap-4 mb-4 pb-2 border-b border-gray">
            <h2 class="text-xl font-semibold text-white">Populære videoer</h2>
        </div>
    {/if}

    <VideoList />
</div>
</div>
