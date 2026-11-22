import { Storage }from  "@google-cloud/storage";
import ffmpeg from "fluent-ffmpeg";
import fs from "fs";

const storage = new Storage();
const rawVideoBucketName = "ns-vydio-raw-videos";
const processedVideoBucketName = "ns-vydio-processed-videos";

const localRawVideoPath = "./raw-videos";
const localProcessedVideoPath = "./processed-videos";

export const setUpDirectories = () => {
  ensuneDirectoryExists(localRawVideoPath);
  ensuneDirectoryExists(localProcessedVideoPath);
};



export const convertVideo = (rawVideoName: string, processedVideoName: string) => {
  return new Promise((resolve, reject) => {
    ffmpeg(`${localRawVideoPath}/${rawVideoName}`)
      .outputOptions('-vf', 'scale=-1:360') //360p`
      .on("end", () => {
        console.log("Conversion finished");
        resolve(undefined);
      })
      .on("error", (err) => {
        console.error("Error occurred while converting video:", err);
        reject(err);
      })
      .save(`${localProcessedVideoPath}/${processedVideoName}`)
  });
};


export const downloadRawVideoFromGCS = async (fileName: string) => {
    try {
        const destination = `${localRawVideoPath}/${fileName}`;
        await storage.bucket(rawVideoBucketName).file(fileName).download({ destination });
        console.log(`Downloaded ${fileName} from GCS to ${destination}`);
    } catch (error) {
        console.error("Error occurred while downloading video from GCS:", error);
        throw error;    
    }
}

export const uploadProcessedVideoToGCS = async (fileName: string) => {
    try {
        const options = {
            destination: `${fileName}`,
        };
        const bucket = storage.bucket(processedVideoBucketName);
        await bucket.upload(`${localProcessedVideoPath}/${fileName}`, options);
        await bucket.file(fileName).makePublic();
        console.log(`Uploaded ${fileName} to GCS bucket ${processedVideoBucketName}`);
    } catch (error) {
        console.error("Error occurred while uploading video to GCS:", error);
        throw error;    
    }
}

export const deleteRawLocalVideo = (fileName: string) => {
    return deleteFile(`${localRawVideoPath}/${fileName}`);
}

export const deleteProcessedLocalVideo = (fileName: string) => {
    return deleteFile(`${localProcessedVideoPath}/${fileName}`);
}

const ensuneDirectoryExists = (directoryPath: string) => {
    if (!fs.existsSync(directoryPath)) {
        fs.mkdirSync(directoryPath, { recursive: true });
        console.log(`Created directory: ${directoryPath}`);
    }
}

export const deleteFile = (filePath: string) : Promise<void> => {
    return new Promise((resolve, reject) => {
        if (fs.existsSync(filePath)) {
            fs.unlink(filePath, (err) => {
                if (err) {
                    console.error(`Error deleting file: ${filePath}`, err);
                    reject(err);
                }
                else{
                    console.log(`Deleted file: ${filePath}`);
                    resolve();
                }
            })
        } else {
            console.warn(`File not found: ${filePath}`);
            reject(new Error("File not found"));
        }
    });
}


const cleanUpLocalFiles = (fileNames: string[]) => {
    fileNames.forEach((fileName) => {
        const rawVideoPath = `${localRawVideoPath}/${fileName}`;
        const processedVideoPath = `${localProcessedVideoPath}/${fileName}`;

        if (fs.existsSync(rawVideoPath)) {
            fs.unlinkSync(rawVideoPath);
            console.log(`Deleted local raw video file: ${rawVideoPath}`);
        }

        if (fs.existsSync(processedVideoPath)) {
            fs.unlinkSync(processedVideoPath);
            console.log(`Deleted local processed video file: ${processedVideoPath}`);
        }
    });
}