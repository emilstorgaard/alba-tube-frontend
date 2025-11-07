<script lang="ts">
    import PlaylistList from '$lib/components/PlaylistList.svelte';
    import { selectedPlaylistStore, playlistsStore } from '$lib/stores/playlistStore';
    import { deletePlaylist } from '$lib/utils/playlists';
    import AddSongsToPlaylistModal from '$lib/components/AddSongsToPlaylistModal.svelte';
    import EditPlaylistModal from '$lib/components/EditPlaylistModal.svelte';
    import { fetchSongs } from '$lib/utils/songs'
	import { userStore } from '$lib/stores/auth';
	import SongList from '$lib/components/SongList.svelte';
    import { fetchPlaylists } from '$lib/utils/playlists';
	import { API_BASE_URL } from '$lib/utils/config';
	import { triggerToast } from '$lib/stores/toastStore';
	import UserList from '$lib/components/UserList.svelte';
	import { selectedUserStore } from '$lib/stores/userStore';
	import VideoList from '$lib/components/VideoList.svelte';

    let showSettings = false;
    let showAddSongModal = false;
    let showEditPlaylistModal = false;
    let showModal = false;

    async function handleDeletePlaylist() {
        try {
			const jwt = $userStore?.jwt

            if (!jwt) throw new Error("Authentication token (JWT) is required.");

            await deletePlaylist($selectedPlaylistStore, jwt)
            await fetchPlaylists(jwt);
			close()
        } catch (error: any) {
            triggerToast(error.message, 'error');
        }
    }

    async function handleUpdate() {
        try {
            const jwt = $userStore?.jwt;

            if (!jwt) throw new Error("Authentication token (JWT) is required.");

            await fetchPlaylists(jwt);
            const selectedPlaylist = $selectedPlaylistStore;
            const updatedPlaylist = $playlistsStore.find(playlist => playlist.id === selectedPlaylist?.id);
            if (updatedPlaylist) {
                selectedPlaylistStore.set(updatedPlaylist);
            } else {
                console.error('Updated playlist not found in the store.');
            }

           
        } catch (error: any) {
            triggerToast(error.message, 'error');
        }
    }

    const openAddSongModal = () => { showSettings = false; showAddSongModal = true; };
    const closeAddSongModal = () => { showAddSongModal = false; };

    const openEditPlaylistModal = () => { showSettings = false; showEditPlaylistModal = true; };
    const closeEditPlaylistModal = () => { showEditPlaylistModal = false; };
</script>

<div class="flex-grow flex flex-col lg:flex-row gap-4 px-4 py-4 min-h-[85vh]">
  <!-- Sidebar -->
  <div class="lg:w-1/4 w-full flex flex-col bg-dark-gray rounded-lg shadow-lg p-4 overflow-y-auto max-h-[80vh]">
    <div class="flex justify-between items-center mb-4 pb-2 border-b border-gray">
      <h2 class="text-xl font-semibold text-white">Kanaler</h2>
    </div>
    <UserList />
    <PlaylistList />
  </div>

  <!-- Selected User Videos -->
{#if $selectedUserStore}
<div class="lg:w-3/4 w-full flex flex-col bg-dark-gray rounded-lg shadow-lg p-4 overflow-y-auto max-h-[80vh] scrollbar-thin scrollbar-thumb-gray scrollbar-track-dark-gray">
  <div class="flex items-center gap-4 mb-4 pb-2 border-b border-gray">
    <!-- Profilbillede -->
    <img
      src={`${API_BASE_URL}/videos/thumbnail/${$selectedUserStore?.profileImageParh}`}
      alt="Profilbillede"
      class="w-16 h-16 rounded-full object-cover border-2 border-gray"
    />

    <!-- Brugernavn + abonnenter -->
    <div class="flex flex-col">
      <h2 class="text-xl font-semibold text-white">
        {$selectedUserStore?.username}
      </h2>
      <p class="text-sm text-white">
        {$selectedUserStore?.subscriberCount} abonnenter
      </p>
    </div>
  </div>

  <VideoList />
</div>
{/if}


  <!-- Selected Playlist -->
  {#if $selectedPlaylistStore}
    <div class="lg:w-3/4 w-full flex flex-col bg-dark-gray rounded-lg shadow-lg p-4 overflow-y-auto max-h-[80vh] relative">
      <div class="flex justify-between items-center mb-4 pb-2 border-b border-gray">
        <div class="flex items-center gap-4">
          <img
            src="{API_BASE_URL}/songs/cover/{$selectedPlaylistStore?.coverImagePath}"
            alt={$selectedPlaylistStore?.name}
            class="w-16 h-16 rounded-md object-cover"
          />
          <h2 class="text-xl font-semibold text-white">{$selectedPlaylistStore?.name}</h2>
        </div>
        <button title="Settings" on:click={() => showSettings = !showSettings} class="p-2 rounded-full hover:bg-green transition">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <circle cx="12" cy="5" r="1" />
            <circle cx="12" cy="12" r="1" />
            <circle cx="12" cy="19" r="1" />
          </svg>
        </button>
      </div>

      {#if showSettings}
        <div class="absolute right-0 mt-2 w-56 bg-gray rounded-md shadow-lg z-20">
          <button on:click={openAddSongModal} class="block w-full px-4 py-2 text-left text-white hover:bg-light-gray rounded-md">Add Songs</button>
          <button on:click={openEditPlaylistModal} class="block w-full px-4 py-2 text-left text-white hover:bg-light-gray rounded-md">Edit</button>
          <button on:click={handleDeletePlaylist} class="block w-full px-4 py-2 text-left text-white hover:bg-red-600 rounded-md">Delete</button>
        </div>
      {/if}

      <SongList />

      {#if showAddSongModal}
        <AddSongsToPlaylistModal on:close={closeAddSongModal} on:add={() => fetchSongs($selectedPlaylistStore?.id, $userStore?.jwt)} playlistId={$selectedPlaylistStore?.id} />
      {/if}

      {#if showEditPlaylistModal}
        <EditPlaylistModal on:close={closeEditPlaylistModal} on:update={handleUpdate} />
      {/if}
    </div>
  {/if}
</div>
