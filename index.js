const express = require("express");
const multer = require("multer");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 3000;

// Simple in-memory multer storage
const upload = multer({ storage: multer.memoryStorage() });

// Allow CORS (for frontend if needed)
app.use(cors());

// Dummy face swap function — You should replace with real logic or model call
async function faceSwapBuffer(targetBuffer, faceBuffer) {
  const sharp = require("sharp");

  // Simple overlay for testing — replace with real face-swap logic
  return await sharp(targetBuffer)
    .composite([{ input: faceBuffer, gravity: "center", blend: "over" }])
    .jpeg()
    .toBuffer();
}

// Route: POST /faceswap
app.post("/faceswap", upload.fields([
  { name: "image", maxCount: 1 },
  { name: "face", maxCount: 1 }
]), async (req, res) => {
  try {
    const image = req.files?.image?.[0];
    const face = req.files?.face?.[0];

    if (!image || !face) {
      return res.status(400).send("❌ Required fields 'image' and 'face' are missing.");
    }

    const outputBuffer = await faceSwapBuffer(image.buffer, face.buffer);

    res.set("Content-Type", "image/jpeg");
    return res.send(outputBuffer);
  } catch (err) {
    console.error("❌ Face Swap Error:", err);
    return res.status(500).send("❌ Error during face swap: " + err.message);
  }
});

// Root for testing
app.get("/", (req, res) => {
  res.send("✅ NXO Face Swap API is live!");
});

// Start server
app.listen(port, () => {
  console.log(`🚀 API running at http://localhost:${port}`);
});
