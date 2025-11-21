export interface Video {
    id: number;
    title: string;
    description: string;
    duration: string;
    videoPath: string;
    thumbnailPath: string;
    isLiked: boolean;
    userId: number;
    viewCount: number;
    likeCount: number;
    createdAtUtc: string;
}

export interface Search {
    videos: Video[];
    users: User[];
}

export interface User {
    id: number;
    email: string;
    username: string;
    profileImageParh: string;
    subscriberCount: number;
    isSubscribed: boolean;
}