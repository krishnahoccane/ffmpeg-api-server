\# FFmpeg API Server



A lightweight API to convert audio files to WAV (44.1kHz, 16-bit, stereo) using FFmpeg.  

Built with Node.js + Docker, deployable on Render.



\## Run Locally

```bash

docker build -t ffmpeg-api .

docker run -p 3000:3000 ffmpeg-api



