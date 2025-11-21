<script lang="ts">
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
          <!-- Title -->
          <p class="text-white font-semibold text-sm line-clamp-2">
            {video.title}
          </p>

          <!-- Meta row -->
          <div class="flex items-center justify-between text-white text-xs mt-2">
            <div class="flex items-center space-x-3">
              <!-- Views -->
              <span class="flex items-center space-x-1 opacity-80">
                <span>👁️</span>
                <span>{video.viewCount}</span>
              </span>

              <!-- Likes -->
              <span class="flex items-center space-x-1 opacity-80">
              {#if video.isLiked}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="w-4 h-4"
                  viewBox="0 0 24 24"
                >
                  <path
                    fill="#ffa3d3"
                    d="M2 9h3v12H2a1 1 0 0 1-1-1V10a1 1 0 0 1 1-1Zm5.293-1.293l6.4-6.4a.5.5 0 0 1 .654-.047l.853.64a1.5 1.5 0 0 1 .553 1.57L14.6 8H21a2 2 0 0 1 2 2v2.104a2 2 0 0 1-.15.762l-3.095 7.515a1 1 0 0 1-.925.619H8a1 1 0 0 1-1-1V8.414a1 1 0 0 1 .293-.707Z"
                  />
                </svg>
              {:else}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="w-4 h-4"
                  viewBox="0 0 24 24"
                >
                  <path
                    fill="#ffa3d3"
                    d="M7 21V8l6-5.95q.375-.375.888-.437t.987.187q.475.25.7.7t.1.925L14.55 8H21q.8 0 1.4.6T23 10v2q0 .175-.05.375t-.1.375l-3 7.05q-.225.5-.75.85T18 21H7ZM9 8.85V19h9l3-7v-2h-9l1.35-5.5L9 8.85ZM4 21q-.825 0-1.413-.588T2 19v-9q0-.825.588-1.413T4 8h3v2H4v9h3v2H4Zm5-2V8.85V19Z"
                  />
                </svg>
              {/if}
                <span>{video.likeCount}</span>
              </span>
            </div>

            <!-- Timestamp -->
            <span class="opacity-70">
              {formatCreatedAtTime(video.createdAtUtc)}
            </span>
          </div>
        </div>

      </a>
    {/each}
  </div>
</div>
