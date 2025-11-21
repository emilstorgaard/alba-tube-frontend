<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { API_BASE_URL } from '$lib/utils/config';
	import { dislikeVideo, fetchVideo, likeVideo, deleteVideo } from '$lib/utils/videos';
	import { selectedVideoStore } from '$lib/stores/videoStore';
	import { userStore } from '$lib/stores/auth';
	import { goto } from '$app/navigation';
	import Modal from '$lib/components/Modal.svelte';
	import EditVideoModal from '$lib/components/EditVideoModal.svelte';
	import SidebarProfile from '$lib/components/SidebarProfile.svelte';

	let videoId: number;

	$: videoId = parseInt($page.params.id, 10);

	let mounted = false;

    onMount(() => {
        mounted = true;
    });

    // Reactive fetch, runs whenever params.id changes AND component is mounted
    $: if (mounted && $page.params.id) {
        const id = parseInt($page.params.id, 10);
        if (!isNaN(id)) {
            fetchVideo(id).catch(err => console.error('Failed to fetch user:', err));
        }
    }

	async function toggleLike() {
		if (!$selectedVideoStore) return;
		if ($selectedVideoStore.isLiked) {
			await dislikeVideo($selectedVideoStore.id);
		} else {
			await likeVideo($selectedVideoStore.id);
		}
		await fetchVideo($selectedVideoStore.id);
	}

	let showDeleteModal = false;
	function openDeleteModal() {
		showDeleteModal = true;
	}
	function closeDeleteModal() {
		showDeleteModal = false;
	}

	async function handleDeleteVideo(videoId: number) {
		await deleteVideo(videoId);
		closeDeleteModal();
		goto('/');
	}

	let showEditModal = false;
	function openEditModal() {
		showEditModal = true;
	}
	function closeEditModal() {
		showEditModal = false;
	}
</script>

<div class="flex-grow flex flex-col lg:flex-row gap-4 px-4 py-4 min-h-[80vh]">
	<!-- Sidebar -->
	<SidebarProfile />

	<!-- Video Box -->
	<div
		class={`flex flex-col bg-dark-gray rounded-lg shadow-lg p-4 overflow-y-auto
        lg:h-[80vh] scrollbar-thin scrollbar-thumb-gray scrollbar-track-dark-gray
        ${$userStore?.user ? 'lg:w-3/4 w-full' : 'w-full lg:w-full'}
    `}
	>
		{#if $selectedVideoStore}
			<!-- Video Player -->
			{#key $selectedVideoStore?.id}
				<video controls class="max-w-full max-h-[50vh] w-full h-auto object-contain bg-black mb-4">
					<source src={`${API_BASE_URL}/videos/${$selectedVideoStore.id}/stream`} />
					Your browser does not support the video tag.
				</video>
			{/key}

			<!-- Video Info -->
			<div class="flex flex-col gap-2">
				<h1 class="text-2xl font-bold text-white">{$selectedVideoStore.title}</h1>
				<div class="flex items-center gap-4 text-white opacity-80 text-sm">
					<div class="flex items-center gap-1 opacity-80">
						<svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 512 512">
							<path
								fill="#ffa3d3"
								d="M0 226v32c128 192 384 192 512 0v-32C384 34 128 34 0 226zm256 144c-70.7 0-128-57.3-128-128s57.3-128 128-128s128 57.3 128 128s-57.3 128-128 128zm0-200c0-8.3 1.7-16.1 4.3-23.6c-1.5-.1-2.8-.4-4.3-.4c-53 0-96 43-96 96s43 96 96 96s96-43 96-96c0-1.5-.4-2.8-.4-4.3c-7.4 2.6-15.3 4.3-23.6 4.3c-39.8 0-72-32.2-72-72z"
							/>
						</svg>
						<span>{Number($selectedVideoStore.viewCount ?? 0).toLocaleString()}</span>
					</div>
					<button on:click={toggleLike} class="flex items-center gap-1">
						{#if $selectedVideoStore.isLiked}
							<svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24">
								<path
									fill="#ffa3d3"
									d="M2 9h3v12H2a1 1 0 0 1-1-1V10a1 1 0 0 1 1-1Zm5.293-1.293l6.4-6.4a.5.5 0 0 1 .654-.047l.853.64a1.5 1.5 0 0 1 .553 1.57L14.6 8H21a2 2 0 0 1 2 2v2.104a2 2 0 0 1-.15.762l-3.095 7.515a1 1 0 0 1-.925.619H8a1 1 0 0 1-1-1V8.414a1 1 0 0 1 .293-.707Z"
								/>
							</svg>
						{:else}
							<svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24">
								<path
									fill="#ffa3d3"
									d="M7 21V8l6-5.95q.375-.375.888-.437t.987.187q.475.25.7.7t.1.925L14.55 8H21q.8 0 1.4.6T23 10v2q0 .175-.05.375t-.1.375l-3 7.05q-.225.5-.75.85T18 21H7ZM9 8.85V19h9l3-7v-2h-9l1.35-5.5L9 8.85ZM4 21q-.825 0-1.413-.588T2 19v-9q0-.825.588-1.413T4 8h3v2H4v9h3v2H4Zm5-2V8.85V19Z"
								/>
							</svg>
						{/if}
						{Number($selectedVideoStore.likeCount ?? 0).toLocaleString()}
					</button>
				</div>

				<p class="text-white mt-2 whitespace-pre-line">{$selectedVideoStore.description}</p>

				{#if $userStore?.user.id === $selectedVideoStore.userId}
					<div class="flex gap-4 mt-4 flex-wrap">
						<button
							class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
							on:click={openEditModal}>Rediger</button
						>
						<button
							class="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
							on:click={openDeleteModal}>Slet</button
						>
					</div>
				{/if}
			</div>

			{#if showDeleteModal}
				<Modal title="Er du sikker?" on:close={closeDeleteModal}>
					<p>Dette vil slette videoen {$selectedVideoStore?.title} permanent.</p>
					<div class="flex justify-end gap-4 mt-6">
						<button
							class="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white"
							on:click={() => handleDeleteVideo($selectedVideoStore.id)}>Slet</button
						>
					</div>
				</Modal>
			{/if}

			{#if showEditModal}
				<EditVideoModal on:close={closeEditModal} />
			{/if}
		{:else}
			<p class="text-white text-lg">Loading video...</p>
		{/if}
	</div>
</div>
