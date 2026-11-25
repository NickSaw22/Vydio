import {httpsCallable} from "firebase/functions";
import {functions} from "./firebase";

type GenerateUploadUrlRequest = {
    fileName: string;
    contentType: string;
};

type GenerateUploadUrlResponse = {
    url: string;
    fileName: string;
};
export interface Video {
    id?: string;
    uid?: string;
    filename?: string;
    status?: "pending" | "processing" | "processed" | "failed";
    title?: string;
    description?: string;
}

const generateUploadUrl = httpsCallable<GenerateUploadUrlRequest, GenerateUploadUrlResponse>(
    functions,
    "generateUploadUrl"
);

type GetVideosResponse = {
    videos: Video[];
};

const getVideosFunction = httpsCallable<void, GetVideosResponse>(functions, "getVideos");

export const uploadVideo = async (file: File) => {
    try {
        const response = await generateUploadUrl({
            fileName: file.name,
            contentType: file.type
        });
        const {url} = response.data;
        const uploadResponse = await fetch(url, {
            method: "PUT",
            body: file,
            headers: {
                "Content-Type": file.type
            }
        });
        if (!uploadResponse.ok) {
            throw new Error(`Video upload failed (${uploadResponse.status} ${uploadResponse.statusText})`);
        }
    } catch (error) {
        console.error("Error occurred while uploading video:", error);
        throw error;
    }
}

export async function getVideos() {
    const response = await getVideosFunction();
    return response.data.videos;
}