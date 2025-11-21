<script lang="ts">
	import { userStore } from '$lib/stores/auth';
	import VideoList from '$lib/components/VideoList.svelte';
	import { onMount } from 'svelte';
	import { fetchPopularVideos } from '$lib/utils/videos';
	import SidebarProfile from '$lib/components/SidebarProfile.svelte';

	onMount(async () => {
		try {
			await fetchPopularVideos();
		} catch (e) {
			console.error('Failed to load popular videos:', e);
		}
	});
</script>

<div class="flex-grow flex flex-col lg:flex-row gap-4 px-4 py-4 min-h-[80vh]">
	<SidebarProfile />

	<!-- Video boks -->
	<div
		class={`flex flex-col bg-dark-gray rounded-lg shadow-lg p-4 overflow-y-auto
        lg:h-[80vh] scrollbar-thin scrollbar-thumb-gray scrollbar-track-dark-gray
        ${$userStore ? 'lg:w-3/4 w-full' : 'w-full lg:w-full'}
    `}
	>
		<div class="flex items-center gap-4 mb-4 pb-2 border-b border-gray">
			<h2 class="text-xl font-semibold text-white">Populære videoer</h2>
		</div>

		<VideoList />
	</div>
</div>
