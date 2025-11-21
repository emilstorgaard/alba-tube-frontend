<script lang="ts">
    import { createEventDispatcher } from 'svelte';
	import { userStore } from '$lib/stores/auth';
	import Modal from './Modal.svelte';
	import { triggerToast } from '$lib/stores/toastStore';
	import { editVideo, fetchVideo} from '$lib/utils/videos';
	import { selectedVideoStore } from '$lib/stores/videoStore';

	let title = $selectedVideoStore?.title || "";
	let description = $selectedVideoStore?.description || "";
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

	async function handleEditVideo(event: SubmitEvent) {
        event.preventDefault();

        try {
			const jwt = $userStore?.jwt;

			if (!jwt) throw new Error("Authentication token (JWT) is required.");

			const videoId = $selectedVideoStore?.id;
			if (!videoId) {
				throw new Error("Video ID is missing. Cannot edit video.");
			}

            await editVideo($selectedVideoStore.id ,title, description, thumbnail, video, jwt);
			close()

			await fetchVideo($selectedVideoStore.id);

			triggerToast('Video uploaded successfully!', 'success');
        } catch (error: any) {
            triggerToast(error.message, 'error');
        }
    }
</script>

<Modal title="Rediger Video" on:close={close}>
<form on:submit={handleEditVideo} class="p-6 space-y-4 md:space-y-6 sm:p-8" enctype="multipart/form-data">

	<div class="space-y-4 md:space-y-6">

		<!-- Title -->
		<div>
			<label for="title" class="block mb-2 text-sm font-medium">Titel</label>
			<input
				type="text"
				name="title"
				bind:value={title}
				id="title"
				class="w-full bg-gray text-white p-2 rounded focus:outline-none focus:ring-2 focus:ring-green"
				placeholder="Titel"
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
				class="w-full bg-gray text-white p-2 rounded focus:outline-none focus:ring-2 focus:ring-green"
				on:change={handleVideoChange}
			/>
		</div>
		
		<button
			type="submit"
			title="Rediger"
			class="w-full bg-green text-white hover:bg-light-green px-4 py-2 rounded-md font-semibold transition duration-300 ease-in-out"
		>
			Rediger
		</button>
	</div>
</form>

</Modal>