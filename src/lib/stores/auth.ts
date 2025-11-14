import type { User } from '$lib/utils/types';
import { writable } from 'svelte/store';

export const userStore = writable<{ jwt: string, user: User } | null>(null);