<script>
	import '../styles/app.css';

	import Header from '$lib/components/Header.svelte';
	import Footer from '$lib/components/Footer.svelte';

	import { page } from '$app/stores';

	import { userStore } from '$lib/stores/auth';
	import Toast from '$lib/components/Toast.svelte';
	import { fetchUserData } from '$lib/utils/user';

	$: if (!$page.data.loggedInUser) {
		userStore.set(null);
	}

	$: if ($page.data.loggedInUser) {
		fetchUserData();
    }
</script>

<svelte:head>
	<title>AlbaTube</title>
</svelte:head>

<Header title="AlbaTube" />

<main>
	<slot />
	<Toast />
</main>

<Footer year="2024" domain="albatube.dk" name="Emil Storgaard" />