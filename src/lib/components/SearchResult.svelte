<script lang="ts">
    import SearchResultSongList from './SearchResultSongList.svelte';
    import SearchResultPlaylistList from './SearchResultPlaylistList.svelte';
    import type { Video, User } from '$lib/utils/types';

    export let videos: Video[] = [];
    export let users: User[] = [];
</script>

<div class="mt-8 bg-dark-gray text-white rounded-lg p-6 shadow-lg w-full border border-green max-h-[80vh]">
    {#if videos.length > 0}
        <h2 class="text-2xl font-semibold text-light-gray">Videos</h2>
        <div class="overflow-y-auto max-h-[32vh]">
            <SearchResultSongList {videos} />
        </div>
    {/if}

    {#if users.length > 0}
        <h2 class="text-2xl font-semibold text-light-gray mt-4">Users</h2>
        <div class="overflow-y-auto max-h-[32vh]">
            <SearchResultPlaylistList {users} />
        </div>
    {/if}
</div>