const express = require('express');
const multer = require('multer');
const { execFile } = require('child_process');
const fs = require('fs');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

const upload = multer({ dest: 'temp/' });

app.post('/faceswap', upload.fields([{ name: 'face' }, { name: 'target' }]), (req, res) => {
  const faceImg = req.files['face'][0].path;
  const targetImg = req.files['target'][0].path;
  const outputImg = `temp/output_${Date.now()}.jpg`;

  execFile('python3', ['swap.py', faceImg, targetImg, outputImg], (error, stdout, stderr) => {
    if (error) {
      return res.status(500).json({ error: 'Face swap failed', details: stderr.toString() });
    }

    res.sendFile(path.resolve(outputImg), () => {
      fs.unlinkSync(faceImg);
      fs.unlinkSync(targetImg);
      fs.unlinkSync(outputImg);
    });
  });
});

app.get('/', (req, res) => {
  res.send('✅ FaceSwap API is running!');
});

app.listen(port, () => {
  console.log(`🚀 Server running at http://localhost:${port}`);
});
