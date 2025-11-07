import { writable } from 'svelte/store';
import type { Video } from '$lib/utils/types';

export const selectedVideoStore = writable<Video | null>(null);