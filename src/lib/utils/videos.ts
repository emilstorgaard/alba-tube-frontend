import { selectedUserVideosStore } from "$lib/stores/userStore";
import { selectedVideoStore } from "$lib/stores/videoStore";
import { API_BASE_URL } from "./config";
import { getCookie } from "./cookies";

export const fetchVideos = async (userId: number) => {
    const jwt = getCookie('jwt');
    const headers: Record<string, string> = {};

    if (jwt) {
        headers['Authorization'] = `Bearer ${jwt}`;
    }

    const response = await fetch(`${API_BASE_URL}/Videos/user/${userId}`, {
        method: "GET",
        headers 
    });
    
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Get vidoes by user failed.");
    }
        
    const videos = await response.json();
    console.log(videos);
    selectedUserVideosStore.set(videos);
};

export const fetchPopularVideos = async () => {
    const jwt = getCookie('jwt');
    const headers: Record<string, string> = {};
    
    if (jwt) {
        headers['Authorization'] = `Bearer ${jwt}`;
    }

    const response = await fetch(`${API_BASE_URL}/Videos/popular`, {
        method: "GET",
        headers
    });
    
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Get vidoes by user failed.");
    }
        
    const videos = await response.json();
    selectedUserVideosStore.set(videos);
};

export const fetchVideo = async (videoId: number) => {
    const jwt = getCookie('jwt');
    const headers: Record<string, string> = {};

    if (jwt) {
        headers['Authorization'] = `Bearer ${jwt}`;
    }

    const response = await fetch(`${API_BASE_URL}/videos/${videoId}`, {
        method: "GET",
        headers
    });
    
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Get vidoe by id failed.");
    }
        
    const video = await response.json();
    selectedVideoStore.set(video);
};

function getVideoDuration(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video');
    video.preload = 'metadata';

    video.onloadedmetadata = () => {
      const durationSeconds = video.duration;
      if (isNaN(durationSeconds) || durationSeconds === Infinity) {
        reject(new Error("Could not read video duration"));
        return;
      }

      const hours = Math.floor(durationSeconds / 3600);
      const minutes = Math.floor((durationSeconds % 3600) / 60);
      const seconds = Math.floor(durationSeconds % 60);

      const formatted = `${hours.toString().padStart(2, '0')}:` +
                        `${minutes.toString().padStart(2, '0')}:` +
                        `${seconds.toString().padStart(2, '0')}`;

      resolve(formatted);
    };

    video.onerror = () => reject(new Error("Error loading video metadata"));
    video.src = URL.createObjectURL(file);
  });
}

export async function uploadVideo(title: string, description: string, thumbnail: File | null, video: File | null, jwt: string) {
    if (typeof title !== 'string' || typeof description !== 'string' || !title || !description || !video || !(video instanceof File)) {
        throw new Error("Invalid data.");
    }

    if (thumbnail && !(thumbnail instanceof File)) {
        throw new Error("Invalid data.");
    }

    if (!jwt) {
        throw new Error("Authentication token (JWT) is required.");
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("duration", await getVideoDuration(video!));
    formData.append("video", video);

    if (thumbnail) {
        formData.append("thumbnail", thumbnail);
    }

    const response = await fetch(`${API_BASE_URL}/videos`, {
        method: "POST",
        headers: {
            'Authorization': `Bearer ${jwt}`
        },
        body: formData,
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Upload video failed.");
    }
    
    return;
}

export async function editVideo(id: number ,title: string, description: string, thumbnail: File | null, video: File | null, jwt: string) {
    if (typeof title !== 'string' || typeof description !== 'string' || !title || !description) {
        throw new Error("Invalid data.");
    }

    if (!jwt) {
        throw new Error("Authentication token (JWT) is required.");
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);

    if (video && video instanceof File) {
        formData.append("video", video);
        formData.append("duration", await getVideoDuration(video!));
    }

    if (thumbnail && thumbnail instanceof File) {
        formData.append("thumbnail", thumbnail);
    }

    const response = await fetch(`${API_BASE_URL}/videos/${id}`, {
        method: "PUT",
        headers: {
            'Authorization': `Bearer ${jwt}`
        },
        body: formData,
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Upload video failed.");
    }
    
    return;
}

export async function likeVideo(videoId: Number) {
    const jwt = getCookie('jwt');
    const response = await fetch(`${API_BASE_URL}/videos/${videoId}/like`, {
        method: "POST",
        headers: { 'Authorization': `Bearer ${jwt}` }
    });
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Liking video failed.");
    }

    return;
}

export async function dislikeVideo(videoId: Number) {
    const jwt = getCookie('jwt');
    const response = await fetch(`${API_BASE_URL}/videos/${videoId}/dislike`, {
        method: "POST",
        headers: { 'Authorization': `Bearer ${jwt}` }
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Disliking video failed.");
    }
    return;
}

export async function deleteVideo(videoId: Number) {
    const jwt = getCookie('jwt');

    if (!jwt) {
        throw new Error("User is not authenticated.");
    }

    const response = await fetch(`${API_BASE_URL}/videos/${videoId}`, {
        method: "DELETE",
        headers: { 'Authorization': `Bearer ${jwt}` }
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Video deletion failed.");
    }
    
    return
}