<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { API_BASE_URL } from '$lib/utils/config';
	import { dislikeVideo, fetchVideo, likeVideo } from '$lib/utils/videos';
	import { selectedVideoStore } from '$lib/stores/videoStore';

	let videoId: number;

	// Ensure videoId is an integer
	$: videoId = parseInt($page.params.id, 10);

	onMount(async () => {
		if (!isNaN(videoId)) {
			try {
				await fetchVideo(videoId);
			} catch (err) {
				console.error('Failed to fetch video:', err);
			}
		} else {
			console.error('Invalid video ID');
		}
	});

	async function toggleLike() {
		try {
			if ($selectedVideoStore == null) return;
			if ($selectedVideoStore?.isLiked) {
				await dislikeVideo($selectedVideoStore.id);
			} else {
				await likeVideo($selectedVideoStore?.id);
			}

			await fetchVideo($selectedVideoStore.id);
		} catch (err) {
			console.error('Failed to toggle like:', err);
		}
	}
</script>

<div class="flex flex-col gap-6 p-6 bg-gray-900 min-h-screen max-w-5xl mx-auto">
	{#if $selectedVideoStore}
		<!-- Video Player -->
		<div class="w-full aspect-video bg-black rounded-xl shadow-2xl overflow-hidden">
			<video controls class="w-full h-full bg-black">
				<source src={`${API_BASE_URL}/videos/${$selectedVideoStore.id}/stream`} type="video/mp4" />
				Your browser does not support the video tag.
			</video>
		</div>

		<!-- Video Info Card -->
		<div class="flex flex-col bg-dark-gray p-6 rounded-xl shadow-lg border border-gray-700">
			<h1 class="text-3xl font-bold text-white mb-3 line-clamp-2">
				{$selectedVideoStore.title}
			</h1>

			<!-- Stats (views, likes, time) -->
			<div class="flex items-center justify-between text-white text-sm mb-4">
				<div class="flex items-center gap-3">
					<span>👁️ {Number($selectedVideoStore.viewCount ?? 0).toLocaleString()}</span>

					<button class="flex items-center gap-1 text-red-500 font-medium" on:click={toggleLike}>
						<span>❤️</span>
						<span>{Number($selectedVideoStore.likeCount ?? 0).toLocaleString()}</span>
						<span class="text-xs">{$selectedVideoStore.isLiked ? '(Du har liket)' : ''}</span>
					</button>
				</div>
			</div>
			<!-- Description -->
			<p class="text-white text-base leading-relaxed whitespace-pre-line">
				{$selectedVideoStore.description}
			</p>
		</div>
	{:else}
		<p class="text-white text-lg">Loading video...</p>
	{/if}
</div>
