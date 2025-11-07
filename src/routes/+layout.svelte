<script>
	import '../styles/app.css';

	import Header from '$lib/components/Header.svelte';
	import Footer from '$lib/components/Footer.svelte';

	import { page } from '$app/stores';
	import { selectedPlaylistStore, selectedPlaylistSongsStore } from '$lib/stores/playlistStore';

	import { userStore } from '$lib/stores/auth';
	import Toast from '$lib/components/Toast.svelte';
	import { currentSong } from '$lib/stores/songStore';

	$: if (!$page.data.loggedInUser) {
	    selectedPlaylistStore.set(null);
	    selectedPlaylistSongsStore.set([]);
		userStore.set(null);
	}

	$: if ($page.data.loggedInUser) {
		userStore.set($page.data.loggedInUser);
    }

	$: title = $currentSong ? `${$currentSong.title} - ${$currentSong.artist}` : 'AlbaTube';
</script>

<svelte:head>
	<title>{title}</title>
</svelte:head>

<Header title="AlbaTube" />

<main>
	<slot />
	<Toast />
</main>

<Footer year="2024" domain="albatube.dk" name="Emil Storgaard" />