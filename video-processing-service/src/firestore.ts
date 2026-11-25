import {Firestore} from "firebase-admin/firestore";
import { applicationDefault, initializeApp } from "firebase-admin/app";

initializeApp({
  credential: applicationDefault(),
});

export const firestore = new Firestore();

const videoCollectionId = "videos";

export interface Video{
    id?: string;
    uid?: string;
    filename?: string;
    status?: "pending" | "processing" | "processed" | "failed";
    title?: string;
    description?: string;
}

async function getVideo(vidoeId: string) {
 const snapshot = await firestore.collection(videoCollectionId).doc(vidoeId).get();
 return snapshot.exists ? snapshot.data() as Video : {};
}

export async function setVideo(videoId: string, video: Video){
    return firestore.collection(videoCollectionId).doc(videoId).set(video, {merge: true});
}

export async function isVideoNew(videoId: string){
    const video = await getVideo(videoId);
    return video?.status === undefined;
}