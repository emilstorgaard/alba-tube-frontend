<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { API_BASE_URL } from '$lib/utils/config';
	import { dislikeVideo, fetchVideo, likeVideo, deleteVideo } from '$lib/utils/videos';
	import { selectedVideoStore } from '$lib/stores/videoStore';
	import Modal from '$lib/components/Modal.svelte';
	import { userStore } from '$lib/stores/auth';
	import { goto } from '$app/navigation';

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

	let showDeleteModal = false;

	function openDeleteModal() {
		showDeleteModal = true;
	}

	async function handleDeleteVideo(videoId: number) {
		await deleteVideo(videoId);
		closeDeleteModal();
		goto('/'); // Redirect to front page
	}

	function closeDeleteModal() {
		showDeleteModal = false;
	}
</script>

<div class="flex flex-col gap-6 p-6 bg-gray-900 max-w-5xl mx-auto">
	{#if $selectedVideoStore}
		<!-- Video Player -->
		<div class="w-full max-h-[60vh] bg-black rounded-xl shadow-2xl overflow-hidden">
			<video controls class="w-full h-full object-contain bg-black">
				<source src={`${API_BASE_URL}/videos/${$selectedVideoStore.id}/stream`} type="video/mp4" />
				Your browser does not support the video tag.
			</video>
		</div>

		<!-- Video Info Card -->
		<div class="flex flex-col bg-dark-gray p-6 rounded-xl shadow-lg border border-gray-700">
			<h1 class="text-3xl font-bold text-white mb-3 line-clamp-2">
				{$selectedVideoStore.title}
			</h1>

			<!-- Stats -->
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

			{#if $userStore?.user.id === $selectedVideoStore.userId}
			<!-- Edit / Delete Buttons -->
			<div class="mt-4 flex gap-4 flex-wrap">
				<button class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Rediger</button>
				<button class="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
				 on:click={openDeleteModal}
				>Slet</button>
			</div>
			{/if}
		</div>

		{#if showDeleteModal}
		<Modal title="Er du sikker?" on:close={closeDeleteModal}>
			<p>Dette vil slette videon {$selectedVideoStore?.title} permanent.</p>
			<div class="flex justify-end gap-4 mt-6">
				<button class="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white"
					on:click={() => handleDeleteVideo($selectedVideoStore.id)}
				>
					Slet
				</button>
			</div>
		</Modal>
		{/if}
	{:else}
		<p class="text-white text-lg">Loading video...</p>
	{/if}
</div>