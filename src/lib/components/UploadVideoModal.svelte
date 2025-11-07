<script lang="ts">
    import { createEventDispatcher } from 'svelte';
	import { uploadSong } from "$lib/utils/songs"
	import { userStore } from '$lib/stores/auth';
	import Modal from './Modal.svelte';
	import { triggerToast } from '$lib/stores/toastStore';
	import { uploadVideo } from '$lib/utils/videos';

	let title = "";
	let description = "";
	let video: File | null = null;
	let thumbnail: File | null = null;

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

        try {
			const jwt = $userStore?.jwt

			if (!jwt) throw new Error("Authentication token (JWT) is required.");

            await uploadVideo(title, description, thumbnail, video, jwt);
			close()
        } catch (error: any) {
            triggerToast(error.message, 'error');
        }
    }
</script>

<Modal title="Upload Video" on:close={close}>
	<form on:submit={handleUploadVideo} class="p-6 space-y-4 md:space-y-6 sm:p-8" enctype="multipart/form-data">

		<div class="space-y-4 md:space-y-6" >
			<div>
				<label for="title" class="block mb-2 text-sm font-medium">Title</label>
				<input
					type="text"
					name="title"
					bind:value={title}
					id="title"
					class="w-full bg-gray text-white p-2 rounded block w-full p-2.5 focus:outline-none focus:ring-2 focus:ring-green"
					placeholder="Title"
					required
				/>
			</div>

			<div>
				<label for="Description" class="block mb-2 text-sm font-medium">Beskrivelse</label>
				<input
					type="text"
					name="description"
					bind:value={description}
					id="description"
					class="w-full bg-gray text-white p-2 rounded block w-full p-2.5 focus:outline-none focus:ring-2 focus:ring-green"
					placeholder="Beskrivelse"
					required
				/>
			</div>

			<!-- Thumbnail Upload -->
			<div>
				<label for="thumbnail" class="block mb-2 text-sm font-medium">Thumbnail</label>
				<input
					type="file"
					name="thumbnail"
					id="thumbnail"
					accept="image/*"
					class="w-full bg-gray text-white p-2 rounded block w-full p-2.5 focus:outline-none focus:ring-2 focus:ring-green"
					on:change={handleThumbnailChange}
				/>
			</div>

			<!-- Video Upload -->
			<div>
				<label for="video" class="block mb-2 text-sm font-medium">Video File</label>
				<input
					type="file"
					name="video"
					bind:value={video}
					id="video"
					accept="video/*"
					required
					class="w-full bg-gray text-white p-2 rounded block w-full p-2.5 focus:outline-none focus:ring-2 focus:ring-green"
					on:change={handleVideoChange}
				/>
			</div>
			
			<button type="submit" title="Upload" class="w-full bg-green text-white hover:bg-light-green px-4 py-2 rounded-md font-semibold transition duration-300 ease-in-out">Upload</button>
		</div>
	</form>
</Modal>