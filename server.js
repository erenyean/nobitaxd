import express from "express";
import { exec } from "child_process";
import util from "util";
import fs from "fs";

const app = express();
const execPromise = util.promisify(exec);

// If cookies stored in environment variable, write them to file
if (process.env.COOKIES) {
  fs.writeFileSync("cookies.txt", process.env.COOKIES);
}

app.get("/downloader/youtube/play/v1", async (req, res) => {
  const q = req.query.q;
  if (!q) return res.json({ success: false, message: "Missing query" });

  try {
    const { stdout } = await execPromise(
      `yt-dlp -j --cookies cookies.txt "${q}"`
    );
    const info = JSON.parse(stdout);

    const audio = info.formats.find(f => f.asr);
    res.json({
      success: true,
      result: {
        metadata: {
          title: info.title,
          channel: info.channel,
          duration: info.duration,
          cover: info.thumbnail,
          url: info.webpage_url
        },
        downloadUrl: audio?.url
      },
      timestamp: new Date().toISOString()
    });
  } catch (e) {
    res.json({ success: false, message: "Failed to fetch video" });
  }
});

app.listen(3000, () => console.log("✅ API running on port 3000"));
export default app;
