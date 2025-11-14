import { userStore } from "$lib/stores/auth";
import { selectedUserStore, usersStore } from "$lib/stores/userStore";
import { getCookie } from "./cookies";
import { API_BASE_URL } from "$lib/utils/config";

export async function fetchUserData() {
    const jwt = getCookie('jwt')

    if (!jwt) {
      console.warn("JWT not found in cookies. User might not be logged in.");
      return;
    }

    const response = await fetch(`${API_BASE_URL}/users/authorized`, {
        method: "GET",
        headers: { 'Authorization': `Bearer ${jwt}` }
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "FetchUserData fejlede");
    }

    const data = await response.json();

    userStore.set({ jwt, user: data });
}

export async function fetchUser(userId: number) {
    console.log("Fetching user with ID:", userId);
    const jwt = getCookie('jwt')

    if (!jwt) {
      console.warn("JWT not found in cookies. User might not be logged in.");
      return;
    }

    const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
        method: "GET",
        headers: { 'Authorization': `Bearer ${jwt}` }
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "FetchUser fejlede");
    }

    const data = await response.json();
    selectedUserStore.set(data);
}

export async function fetchUsers() {
    const jwt = getCookie('jwt');
    const headers: Record<string, string> = {};

    if (jwt) {
        headers['Authorization'] = `Bearer ${jwt}`;
    }

    const response = await fetch(`${API_BASE_URL}/users`, {
        method: "GET",
        headers 
    })

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Fetch Users failed.");
    }

    const users = await response.json();
    usersStore.set(users);
}

export async function fetchSubscriptions() {
    const jwt = getCookie('jwt');
    const headers: Record<string, string> = {};

    if (jwt) {
        headers['Authorization'] = `Bearer ${jwt}`;
    }

    const response = await fetch(`${API_BASE_URL}/users/subscriptions`, {
        method: "GET",
        headers 
    })

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Fetch Users failed.");
    }

    const users = await response.json();
    usersStore.set(users);
}

export async function subscribeToUser(userId: number) {
    const jwt = getCookie('jwt');
    if (!jwt) {
        throw new Error("User is not authenticated.");
    }

    const response = await fetch(`${API_BASE_URL}/users/${userId}/subscribe`, {
        method: "POST",
        headers: { 'Authorization': `Bearer ${jwt}` }
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Subscription failed.");
    }

    return await response.json();
}

export async function unsubscribeFromUser(userId: number) {
    const jwt = getCookie('jwt');
    if (!jwt) {
        throw new Error("User is not authenticated.");
    }

    const response = await fetch(`${API_BASE_URL}/users/${userId}/subscribe`, {
        method: "DELETE",
        headers: { 'Authorization': `Bearer ${jwt}` }
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Unsubscription failed.");
    }

    return await response.json();
}