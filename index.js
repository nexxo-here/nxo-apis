const express = require("express");
const multer = require("multer");
const fs = require("fs");
const path = require("path");

const app = express();
const port = process.env.PORT || 3000;

// Multer setup
const upload = multer({ dest: "temp/" });

// FaceSwap Endpoint
app.post("/faceswap", upload.fields([
  { name: "image", maxCount: 1 },
  { name: "face", maxCount: 1 }
]), async (req, res) => {
  try {
    if (!req.files?.image || !req.files?.face) {
      return res.status(400).send("❌ Missing image or face file.");
    }

    const imagePath = req.files.image[0].path;
    const facePath = req.files.face[0].path;

    // For now, just return the original image (you can use AI logic here)
    const outputPath = path.join(__dirname, "temp", `output_${Date.now()}.jpg`);
    fs.copyFileSync(imagePath, outputPath);

    res.sendFile(outputPath, () => {
      // Cleanup after sending
      fs.unlinkSync(imagePath);
      fs.unlinkSync(facePath);
      fs.unlinkSync(outputPath);
    });
  } catch (err) {
    console.error("❌ Face Swap Error:", err);
    res.status(500).send("❌ Internal Server Error");
  }
});

// Root test
app.get("/", (req, res) => {
  res.send("✅ NXO FaceSwap API is Running!");
});

app.listen(port, () => {
  console.log(`🚀 Server running on http://localhost:${port}`);
});
