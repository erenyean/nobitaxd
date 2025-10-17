import express from "express";
import { exec } from "child_process";

const app = express();
const PORT = process.env.PORT || 3000;

app.get("/downloader/youtube/play/v1", (req, res) => {
  const url = req.query.q;
  if (!url) return res.json({ success: false, message: "No URL provided" });

  // Using Python yt-dlp
  exec(`yt-dlp -j "${url}"`, (err, stdout, stderr) => {
    if (err) return res.json({ success: false, message: stderr });
    try {
      const data = JSON.parse(stdout);
      res.json({ success: true, result: data });
    } catch (e) {
      res.json({ success: false, message: "Failed to parse video info" });
    }
  });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
