import { userStore } from "$lib/stores/auth";
import { playlistsStore, selectedPlaylistStore, selectedPlaylistSongsStore, selectedPlaylistSongStore } from "$lib/stores/playlistStore";
import { currentSong, isPaused, duration, currentTime, isShuffleEnabled } from "$lib/stores/songStore";
import { stopSong } from "$lib/utils/audioPlayer";
import { setCookie, deleteCookie } from "$lib/utils/cookies"
import { API_BASE_URL } from "./config";

export async function login(email: string, password: string) {
    if (!email || !password || typeof email !== "string" || typeof password !== "string") {
        throw new Error("Email og password er påkrævet.");
    }

    const formData = new URLSearchParams();
    formData.append("Email", email);
    formData.append("Password", password);

    const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        body: formData.toString()
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Login fejlede");
    }

    const data = await response.json();

    const { token } = data

    setCookie("jwt", token, { "max-age": 60 * 60 * 24 * 7, path: '/' });
    return
}

export async function signup(email: string, username: string, password: string, confirmPassword: string, image: File | null) {
    if (!email || !username || !password || !confirmPassword || typeof email !== "string" || typeof password !== "string" || typeof confirmPassword !== "string") {
        throw new Error("Email, username og password er påkrævet.");
    }

    if (image && !(image instanceof File)) {
        throw new Error("Invalid data.");
    }

    if (password != confirmPassword) {
        throw new Error("Passwords does not match!.");
    }

    const formData = new FormData();
    formData.append("Email", email);
    formData.append("Username", username);
    formData.append("Password", password);

    if (image) {
        formData.append("ProfileImage", image);
    }

    const response = await fetch(`${API_BASE_URL}/users/register`, {
        method: "POST",
        body: formData
    });

    console.log("Signup response:", response);

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Signup fejlede");
    }

    return
}

export async function logout() {
    stopSong();

    deleteCookie("jwt")

    userStore.set(null);
    playlistsStore.set([]);
    selectedPlaylistStore.set(null);
    selectedPlaylistSongsStore.set([]);
    selectedPlaylistSongStore.set(null);
    currentSong.set(null);
    isPaused.set(true);
    duration.set(0);
    currentTime.set(0);
    isShuffleEnabled.set(false);

    return;
}