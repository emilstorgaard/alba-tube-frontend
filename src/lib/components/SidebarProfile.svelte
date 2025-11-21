<script>
	import { userStore } from '$lib/stores/auth';
	import UserList from './UserList.svelte';
	import { API_BASE_URL } from '$lib/utils/config';

	// subscribe til userStore
	$: user = $userStore?.user;
</script>

{#if user}
<div class="lg:w-1/4 w-full flex flex-col gap-4 lg:h-[80vh]">
	<!-- Profil boks -->
	<div class="flex flex-col bg-dark-gray rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow duration-200">
		<a
			href={`/user/${user.id}`}
			class="flex items-center space-x-3 hover:bg-gray-800 p-2 rounded-xl transition"
		>
			<img
				src={`${API_BASE_URL}/videos/thumbnail/${user.profileImageParh}`}
				alt="Profilbillede"
				class="w-16 h-16 rounded-full object-cover border-2 border-gray-600"
			/>
			<div class="flex flex-col justify-center">
				<h2 class="text-lg font-semibold text-white truncate">{user.username}</h2>
				<p class="text-sm text-white mt-1">{user.subscriberCount} Abonnementer</p>
			</div>
		</a>
	</div>

	<!-- abonnementer boks -->
	<div class="flex flex-col bg-dark-gray rounded-lg shadow-lg p-4 overflow-y-auto flex-1 lg:h-auto">
		<div class="flex justify-between items-center mb-4 pb-2 border-b border-gray">
			<h2 class="text-xl font-semibold text-white">Abonnementer</h2>
		</div>
		<UserList />
	</div>
</div>
{/if}
