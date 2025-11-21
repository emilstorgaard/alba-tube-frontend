<script lang="ts">
    import type { Video } from '$lib/utils/types';
    import { API_BASE_URL } from '$lib/utils/config';
    import { formatDuration } from '$lib/utils/format';
    import { showSearchResults } from '$lib/stores/searchStore';

    export let videos: Video[] = [];
</script>

<div class="flex-1 overflow-y-auto mt-2 space-y-2">
    {#each videos as video (video.id)}
        <div class="p-2 rounded-md flex items-center gap-4 justify-between relative group hover:bg-gray hover:cursor-pointer transition border-b border-gray">
                           <a
                    href={`/video/${video.id}`}
                    class="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-white rounded-lg opacity-0 group-hover:opacity-100 transition"
                    on:click={(e) => {
                        showSearchResults.set(false);
                        // optionally, allow normal navigation:
                        // e.stopPropagation(); // use this only if you prevent default
                    }}
                ></a>
            
            <div class="relative w-16 h-16 shrink-0">
                <img 
                    src={`${API_BASE_URL}/videos/thumbnail/${video.thumbnailPath}`} 
                    alt={video.title} 
                    class="w-full h-full rounded-lg object-cover transition-opacity duration-300 group-hover:opacity-60"
                />


            </div>
    
            <div class="text-left w-full flex justify-between items-center">
                <div>
                    <h3 class="text-lg font-semibold text-white">{video.title}</h3>
                </div>
                <div class="text-sm text-light-gray w-12 text-right tabular-nums">
                    {formatDuration(video.duration)}
                </div>
            </div>

        </div>
    {/each}
</div>