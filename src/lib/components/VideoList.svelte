<script lang="ts">
  import { currentSongIndex, isPaused } from '$lib/stores/songStore';
  import { fetchVideos } from '$lib/utils/videos';
  import { onMount } from 'svelte';
  import { API_BASE_URL } from '$lib/utils/config';
  import { formatCreatedAtTime, formatDuration } from '$lib/utils/format';
  import { selectedUserStore, selectedUserVideosStore } from '$lib/stores/userStore';

  onMount(() => {
    const unsubscribe = selectedUserStore.subscribe((selectedUser) => {
      if (selectedUser) fetchVideos(selectedUser.id);
    });
    return () => unsubscribe();
  });
</script>

<div class="flex-1 mt-2 px-2 overflow-y-auto max-h-[calc(100vh-8rem)]">
  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
    {#each $selectedUserVideosStore as video}
      <a 
        href={`/video/${video.id}`} 
        class="flex flex-col rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-transform hover:-translate-y-1 bg-dark-gray"
      >
        <!-- Thumbnail -->
        <div class="relative w-full aspect-video overflow-hidden">
          <img 
            src={`${API_BASE_URL}/videos/thumbnail/${video.thumbnailPath}`} 
            alt={video.thumbnailPath} 
            class="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          />
          <!-- Duration Badge -->
          <span class="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded">
            {formatDuration(video.duration)}
          </span>
        </div>

        <!-- Video Info -->
        <div class="flex flex-col p-3">
          <p class="text-white font-semibold text-sm line-clamp-2">{video.title}</p>

          <div class="flex items-center justify-between text-white text-xs mt-2">
            <div class="flex items-center space-x-2">
              <span>👁️ {video.viewCount}</span>
              <span>❤️ {video.likeCount}</span>
            </div>
            <span>{formatCreatedAtTime(video.createdAtUtc)}</span>
          </div>
        </div>
      </a>
    {/each}
  </div>
</div>
