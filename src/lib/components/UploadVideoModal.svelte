<script lang="ts">
    import { createEventDispatcher } from 'svelte';
	import { userStore } from '$lib/stores/auth';
	import Modal from './Modal.svelte';
	import { triggerToast } from '$lib/stores/toastStore';
	import { fetchVideos, uploadVideo } from '$lib/utils/videos';
	import { selectedUserStore } from '$lib/stores/userStore';
	import { goto } from '$app/navigation';

	let title = "";
	let description = "";
	let video: File | null = null;
	let thumbnail: File | null = null;
	let loading = false;

    const dispatch = createEventDispatcher();

    function close() {
        dispatch('close');
    }

	function handleThumbnailChange(event: Event) {
        const target = event.target as HTMLInputElement;
        thumbnail = target.files?.[0] || null;
    }

    function handleVideoChange(event: Event) {
        const target = event.target as HTMLInputElement;
        video = target.files?.[0] || null;
    }

	async function handleUploadVideo(event: SubmitEvent) {
        event.preventDefault();
		loading = true;

        try {
			const jwt = $userStore?.jwt;
			if (!jwt) throw new Error("Authentication token (JWT) is required.");

            await uploadVideo(title, description, thumbnail, video, jwt);
			close()

			if ($selectedUserStore && $userStore && $userStore.user.id === $selectedUserStore.id) {
				await fetchVideos($selectedUserStore.id);
			}

			triggerToast('Video uploaded successfully!', 'success');
        } catch (error: any) {
            triggerToast(error.message, 'error');
        } finally {
            loading = false;
			goto('/user/' + $userStore?.user.id);
        }
    }
</script>

<Modal title="Upload Video" on:close={close}>
<form on:submit={handleUploadVideo} class="p-6 space-y-4 md:space-y-6 sm:p-8" enctype="multipart/form-data">

	<div class="space-y-4 md:space-y-6">

		<!-- Title -->
		<div>
			<label for="title" class="block mb-2 text-sm font-medium">Title</label>
			<input
				type="text"
				name="title"
				bind:value={title}
				id="title"
				class="w-full bg-gray text-white p-2 rounded focus:outline-none focus:ring-2 focus:ring-green"
				placeholder="Title"
				required
			/>
		</div>

		<!-- Description (Updated to textarea) -->
		<div>
			<label for="description" class="block mb-2 text-sm font-medium">Beskrivelse</label>
			<textarea
				name="description"
				bind:value={description}
				id="description"
				class="w-full bg-gray text-white p-2 rounded focus:outline-none focus:ring-2 focus:ring-green resize-y min-h-[100px]"
				placeholder="Beskrivelse"
				required
			></textarea>
		</div>

		<!-- Thumbnail Upload -->
		<div>
			<label for="thumbnail" class="block mb-2 text-sm font-medium">Thumbnail</label>
			<input
				type="file"
				name="thumbnail"
				id="thumbnail"
				accept="image/*"
				class="w-full bg-gray text-white p-2 rounded focus:outline-none focus:ring-2 focus:ring-green"
				on:change={handleThumbnailChange}
			/>
		</div>

		<!-- Video Upload -->
		<div>
			<label for="video" class="block mb-2 text-sm font-medium">Video Fil</label>
			<input
				type="file"
				name="video"
				bind:value={video}
				id="video"
				accept="video/*"
				required
				class="w-full bg-gray text-white p-2 rounded focus:outline-none focus:ring-2 focus:ring-green"
				on:change={handleVideoChange}
			/>
		</div>
		
<button
    type="submit"
    title="Upload"
    class="w-full bg-green text-white hover:bg-light-green px-4 py-2 rounded-md font-semibold transition duration-300 ease-in-out flex items-center justify-center"
>
    {#if loading}
        <svg
            class="animate-spin h-5 w-5 text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
        >
            <circle
                class="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                stroke-width="4"
            ></circle>
            <path
                class="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
            ></path>
        </svg>
    {:else}
        Upload
    {/if}
</button>
	</div>
</form>

</Modal>