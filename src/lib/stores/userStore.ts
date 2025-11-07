import { writable } from 'svelte/store';
import type { User, Video } from '$lib/utils/types';

export const usersStore = writable<User[]>([]);
export const selectedUserStore = writable<User | null>(null);
export const selectedUserVideosStore = writable<Video[]>([]);