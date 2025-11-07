export interface Playlist {
    id: number;
    name: string;
    coverImagePath: string;
    createdAtUtc: string;
    isLiked: boolean;
}

export interface Song {
    id: number;
    title: string;
    artist: string;
    duration: string;
    filePath: string;
    coverImagePath: string;
    isLiked: boolean;
}

export interface Video {
    id: number;
    title: string;
    description: string;
    duration: string;
    videoPath: string;
    thumbnailPath: string;
    isLiked: boolean;
    viewCount: number;
    likeCount: number;
    createdAtUtc: string;
}

export interface Search {
    playlists: Playlist[];
    songs: Song[];
}

export interface User {
    id: number;
    email: string;
    username: string;
    profileImageParh: string;
    subscriberCount: number;
}