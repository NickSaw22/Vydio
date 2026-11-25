'use client';

import { uploadVideo } from "../firebase/functions";

export default function Upload() {

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) {
            return;
        }
        try {
            await uploadVideo(file);
            alert("Video uploaded successfully!");
        } catch (error) {
            console.error("Error occurred while uploading video:", error);
            alert("Failed to upload video. Please try again.");
        }
    };
    return (
        <>
            <input type="file" className="sr-only" id="upload" accept="video/*"
                onChange={handleFileChange}
            />
            <label
                htmlFor="upload"
                className="inline-flex min-h-9 cursor-pointer items-center justify-center gap-2 rounded-md border border-blue-200 bg-white px-3 text-sm font-medium text-blue-700 transition-colors hover:bg-blue-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
            >
                <span className="text-lg font-normal leading-none text-blue-600" aria-hidden="true">+</span>
                <span>Upload video</span>
            </label>
        </>
    )   
}
