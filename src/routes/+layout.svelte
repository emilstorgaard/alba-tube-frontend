<script>
	import '../styles/app.css';

	import Header from '$lib/components/Header.svelte';
	import Footer from '$lib/components/Footer.svelte';

	import { page } from '$app/stores';

	import { userStore } from '$lib/stores/auth';
	import Toast from '$lib/components/Toast.svelte';
	import { currentSong } from '$lib/stores/songStore';
	import { fetchUserData } from '$lib/utils/user';

	$: if (!$page.data.loggedInUser) {
		userStore.set(null);
	}

	$: if ($page.data.loggedInUser) {
		fetchUserData();
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