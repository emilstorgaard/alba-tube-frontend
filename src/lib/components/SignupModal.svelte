<script lang="ts">
    import { createEventDispatcher } from 'svelte';
	import { signup } from "$lib/utils/auth";
	import Modal from './Modal.svelte';
	import { triggerToast } from '$lib/stores/toastStore';

	let username = "";
	let email = "";
	let image: File | null = null;
    let password = "";
	let confirmPassword = "";

    const dispatch = createEventDispatcher();

    function close() {
        dispatch('close');
    }

	function handleImageChange(event: Event) {
        const target = event.target as HTMLInputElement;
        image = target.files?.[0] || null;
    }

    async function handleSignup(event: SubmitEvent) {
        event.preventDefault();

        try {
            await signup(email, username, password, confirmPassword, image);
			close()
        } catch (error: any) {
            triggerToast(error.message, 'error');
        }
    }

</script>

<Modal title="Opret konto" on:close={close}>
	<form on:submit={handleSignup}>
		<div class="space-y-4 md:space-y-6" >
			<div>
				<label for="image" class="block mb-2 text-sm font-medium">Profile Image</label>
				<input
					type="file"
					name="image"
					id="image"
					accept="image/*"
					class="w-full bg-gray text-white p-2 rounded block w-full p-2.5 focus:outline-none focus:ring-2 focus:ring-green"
					on:change={handleImageChange}
				/>
			</div>
			<div>
				<label for="username" class="block mb-2 text-sm font-medium">Username</label>
				<input
					type="text"
					name="username"
					bind:value={username}
					id="username"
					class="w-full bg-gray text-white p-2 rounded block w-full p-2.5 focus:outline-none focus:ring-2 focus:ring-green"
					placeholder="Jens Jensen"
					required
					autocomplete="username"
				/>
			</div>
			<div>
				<label for="email" class="block mb-2 text-sm font-medium">Email</label>
				<input
					type="email"
					name="email"
					bind:value={email}
					id="email"
					class="w-full bg-gray text-white p-2 rounded block w-full p-2.5 focus:outline-none focus:ring-2 focus:ring-green"
					placeholder="jens@jensen.com"
					required
				/>
			</div>
			<div>
				<label for="password" class="block mb-2 text-sm font-medium">Password</label>
				<input
					type="password"
					bind:value={password}
					name="password"
					id="password"
					placeholder="••••••••"
					class="w-full bg-gray text-white p-2 rounded block w-full p-2.5 focus:outline-none focus:ring-2 focus:ring-green"
					required
					autocomplete="new-password"
				/>
			</div>
			<div>
				<label for="repeat-password" class="block mb-2 text-sm font-medium">Repeat Password</label>
				<input
					type="password"
					name="confirmPassword"
					bind:value={confirmPassword}
					id="confirmPassword"
					placeholder="••••••••"
					class="w-full bg-gray text-white p-2 rounded block w-full p-2.5 focus:outline-none focus:ring-2 focus:ring-green"
					required
					autocomplete="new-password"
				/>
			</div>

			<button type="submit" title="Opret konto" class="w-full bg-green text-white hover:bg-light-green px-4 py-2 rounded-md font-semibold transition duration-300 ease-in-out">Opret konto</button>
		</div>
	</form>
</Modal>