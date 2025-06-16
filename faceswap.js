const express = require("express");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const { swapFaces } = require("./faceswapper");

const router = express.Router();
const upload = multer({ dest: "temp/" });

router.post("/faceswap", upload.fields([
  { name: "image", maxCount: 1 },
  { name: "face", maxCount: 1 }
]), async (req, res) => {
  try {
    const { files } = req;
    if (!files || !files.image || !files.face)
      return res.status(400).send("Both 'image' and 'face' fields are required.");

    const imagePath = files.image[0].path;
    const facePath = files.face[0].path;

    const resultBuffer = await swapFaces(imagePath, facePath);

    // Remove temp files
    fs.unlinkSync(imagePath);
    fs.unlinkSync(facePath);

    res.set("Content-Type", "image/jpeg");
    res.send(resultBuffer);
  } catch (err) {
    console.error("Face swap error:", err);
    res.status(500).send("Face swap failed.");
  }
});

module.exports = router;
