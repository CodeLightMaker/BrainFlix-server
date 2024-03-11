const express = require("express");
const app = express();
const cors = require("cors");
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");

app.use(express.json());
app.use(cors());

const port = 5001;
const videosDataPath = "./Data/videos.json";

app.get("/", (req, res) => {
  res.send("BrainFlix Server is running!");
});

app.get("/videos", (req, res) => {
  const videos = require(videosDataPath);
  res.send(videos);
});

app.get("/videos/:id", (req, res) => {
  const id = req.params.id;
  const detailsData = require("./Data/videos.json");
  const details = detailsData.find((detail) => detail.id === id);
  if (details) {
    res.send(details);
  } else {
    res.status(404).send("Details not found");
  }
});

app.post("/videos", (req, res) => {
  const newVideo = req.body;
  newVideo.id = uuidv4();

  try {
    const videos = require(videosDataPath);
    videos.push(newVideo);
    fs.writeFileSync(videosDataPath, JSON.stringify(videos, null, 2));
    res.status(201).send("Video added successfully!");
  } catch (error) {
    console.error("Error adding video:", error);
    res.status(500).send("Error adding video");
  }
});

app.post("/videos/:id/comments", (req, res) => {
  const { id } = req.params;
  const { comment, name } = req.body;

  try {
    const videos = require(videosDataPath);

    const videoIndex = videos.findIndex((video) => video.id === id);

    if (videoIndex !== -1) {
      videos[videoIndex].comments.push({ id: generateId(), comment, name });

      fs.writeFileSync(videosDataPath, JSON.stringify(videos, null, 2));

      res.status(201).json({ message: "Comment added successfully!" });
    } else {
      res.status(404).json({ error: "Video not found" });
    }
  } catch (error) {
    console.error("Error adding comment:", error);
    res.status(500).json({ error: "Error adding comment" });
  }
});

function generateId() {
  return Math.random().toString(36).substr(2, 9);
}

app.delete("/videos/:videoId/comments/:commentId", (req, res) => {
  const { videoId, commentId } = req.params;

  try {
    let videos = require(videosDataPath);

    const videoIndex = videos.findIndex((video) => video.id === videoId);

    if (videoIndex !== -1) {
      const commentIndex = videos[videoIndex].comments.findIndex(
        (comment) => comment.id === commentId
      );

      if (commentIndex !== -1) {
        videos[videoIndex].comments.splice(commentIndex, 1);

        fs.writeFileSync(videosDataPath, JSON.stringify(videos, null, 2));

        res.status(200).json({ message: "Comment deleted successfully!" });
      } else {
        res.status(404).json({ error: "Comment not found" });
      }
    } else {
      res.status(404).json({ error: "Video not found" });
    }
  } catch (error) {
    console.error("Error deleting comment:", error);
    res.status(500).json({ error: "Error deleting comment" });
  }
});

app.put("/videos/:id/likes", (req, res) => {
  const { id } = req.params;

  try {
    let videos = require(videosDataPath);
    const videoIndex = videos.findIndex((video) => video.id === id);

    if (videoIndex !== -1) {
      videos[videoIndex].likes++;
      fs.writeFileSync(videosDataPath, JSON.stringify(videos, null, 2));
      res.status(200).json(videos[videoIndex]);
    } else {
      res.status(404).json({ error: "Video not found" });
    }
  } catch (error) {
    console.error("Error updating likes:", error);
    res.status(500).json({ error: "Error updating likes" });
  }
});

app.listen(port, () => {
  console.log(`Brainflix server is listening on port ${port}`);
});