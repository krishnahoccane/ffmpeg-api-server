import express from "express";
import { exec } from "child_process";
import fs from "fs";

const app = express();
app.use(express.json({ limit: "100mb" }));

// POST /convert
app.post("/convert", async (req, res) => {
  try {
    const { inputUrl, outputName } = req.body;
    if (!inputUrl || !outputName) {
      return res.status(400).json({ error: "Missing inputUrl or outputName" });
    }

    const inputFile = `/tmp/input.mp3`;
    const outputFile = `/tmp/${outputName}.wav`;

    // Download input
    exec(`curl -L "${inputUrl}" -o ${inputFile}`, (err) => {
      if (err) return res.status(500).json({ error: "Download failed" });

      // Run ffmpeg
      const ffmpegCmd = `ffmpeg -i ${inputFile} -ar 44100 -ac 2 -sample_fmt s16 ${outputFile}`;
      exec(ffmpegCmd, (err) => {
        if (err) return res.status(500).json({ error: "FFmpeg failed" });

        // Return base64
        const data = fs.readFileSync(outputFile);
        res.json({
          success: true,
          filename: `${outputName}.wav`,
          file: data.toString("base64"),
        });

        // Cleanup
        fs.unlinkSync(inputFile);
        fs.unlinkSync(outputFile);
      });
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.listen(3000, () => console.log("FFmpeg API running on port 3000"));
