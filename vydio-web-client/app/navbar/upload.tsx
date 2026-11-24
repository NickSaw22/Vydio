'use client';

import {Fragment, useState} from "react";
import { uploadVideo } from "../firebase/functions";
import styles from "./upload.module.css";

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
        <Fragment>
            <input type="file" className={styles.uploadInput} id="upload" accept="video/*" 
                onChange={handleFileChange}
            />
            <label htmlFor="upload" className={styles.uploadButton}>Upload Video</label>
            <svg xmlns="http://www.w3.org/2000/svg" className={styles.uploadIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 11V3m-4 4 4-4 4 4" />
                <rect x="3" y="13" width="14" height="8" rx="2" />
                <path d="m17 16 4-2v6l-4-2" />
            </svg>
        </Fragment>
    )   
}
