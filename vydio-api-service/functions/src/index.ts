import * as functions from "firebase-functions/v1";
// import {onRequest} from "firebase-functions/https";
import * as logger from "firebase-functions/logger";
import {initializeApp} from "firebase-admin/app";
import {Firestore} from "firebase-admin/firestore";
import {Storage} from "@google-cloud/storage";
import {HttpsError, onCall} from "firebase-functions/v2/https";

initializeApp();
const firestore = new Firestore();
const storage = new Storage();
const rawVideoBucketName = "ns-vydio-raw-videos";

// export const helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

export const createUser = functions.auth.user().onCreate((user) => {
  const userInfo = {
    uid: user.uid,
    email: user.email,
    displayName: user.displayName,
    photoURL: user.photoURL,
  };
  firestore.collection("users").doc(user.uid).set(userInfo);
  logger.info(`User created: ${JSON.stringify(userInfo)}`, userInfo);
  return;
});

export const deleteUser = functions.auth.user().onDelete((user) => {
  firestore.collection("users").doc(user.uid).delete();
  logger.info(`User deleted: ${JSON.stringify(user)}`);
});

export const generateUploadUrl = onCall({maxInstances: 1}, async (request) => {
  if (!request.auth) {
    throw new HttpsError("unauthenticated", "User must be authenticated");
  }
  const {fileName: originalFileName, contentType} = request.data;
  if (typeof originalFileName !== "string" || originalFileName.trim() === "") {
    throw new HttpsError("invalid-argument", "File name must be provided");
  }
  if (typeof contentType !== "string" || !contentType.startsWith("video/")) {
    throw new HttpsError("invalid-argument", "video content-type not provided");
  }
  const fileName = `${request.auth.uid}/${Date.now()}-${originalFileName}`;
  const bucket = storage.bucket(rawVideoBucketName);
  const file = bucket.file(fileName);
  const expiresAt = Date.now() + 15 * 60 * 1000; // 15 minutes from now
  const [url] = await file.getSignedUrl({
    version: "v4",
    action: "write",
    expires: expiresAt,
    contentType,
  });
  logger.info(`Generated signed URL for ${fileName}`);
  return {url, fileName};
});

export const getVideos = onCall({maxInstances: 1}, async () => {
  const snapshot = await firestore.collection("videos").get();
  const videos = snapshot.docs.map((doc) => doc.data());
  return {videos};
});
