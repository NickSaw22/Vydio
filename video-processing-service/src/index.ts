import express from "express";
import { setUpDirectories,  downloadRawVideoFromGCS, convertVideo, uploadProcessedVideoToGCS, deleteRawLocalVideo, deleteProcessedLocalVideo } from "./storage";

setUpDirectories();
const app = express();
app.use(express.json());
const PORT = process.env.PORT || 3000; // Use environment variable PORT if available, otherwise default to 3000

app.get("/", (req, res) => {
  res.send("Video Processing Service is running!");
});

app.post("/process-video", async (req, res) => {
    let data;
    try{
        const message = Buffer.from(req.body.message.data, "base64").toString("utf-8");
        data = JSON.parse(message);
        if(!data || !data.name){
            throw new Error("Invalid message format: 'name' field is missing");
        }

        const inputFileName = data.name;
        const outputFileName = `processed-${inputFileName}`;
        
        await downloadRawVideoFromGCS(inputFileName)
        await convertVideo(inputFileName, outputFileName);

        await uploadProcessedVideoToGCS(outputFileName);
        
        await Promise.all([
            deleteRawLocalVideo(inputFileName),
            deleteProcessedLocalVideo(outputFileName)
        ]);

        return res.status(200).send("Video processed successfully");

    }
    catch(err){
        console.error("Error occurred while processing video:", err);
        return res.status(500).send("Error occurred while processing video");
    }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});