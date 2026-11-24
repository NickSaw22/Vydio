import {getFunctions, httpsCallable} from "firebase/functions";

const  functions = getFunctions();
type GenerateUploadUrlRequest = {
    fileName: string;
    contentType: string;
};

type GenerateUploadUrlResponse = {
    url: string;
    fileName: string;
};

const generateUploadUrl = httpsCallable<GenerateUploadUrlRequest, GenerateUploadUrlResponse>(
    functions,
    "generateUploadUrl"
);

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