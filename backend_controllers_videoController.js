const ffmpeg = require('fluent-ffmpeg');
const fs = require('fs');
const path = require('path');
const axios = require('axios');

// টেক্সট টু স্পিচ (Google TTS - ফ্রি)
exports.generateSpeech = async (req, res) => {
  try {
    const { text, promptId, language = 'bn' } = req.body;

    if (!text) {
      return res.status(400).json({ error: 'Text is required' });
    }

    // Google Translate API (ফ্রি টিয়ার)
    const audioUrl = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(text)}&tl=${language}&client=tw-ob`;

    const audioPath = `uploads/audio_${promptId}_${Date.now()}.mp3`;

    // অডিও ডাউনলোড করুন
    const response = await axios.get(audioUrl, { responseType: 'stream' });
    const stream = fs.createWriteStream(audioPath);

    response.data.pipe(stream);

    stream.on('finish', () => {
      res.json({
        promptId: promptId,
        audioPath: `/${audioPath}`,
        success: true
      });
    });

    stream.on('error', (err) => {
      res.status(500).json({ error: 'Failed to generate speech' });
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ভিডিও ক্লিপ তৈরি করুন (ছবি + অডিও)
exports.createVideoClip = async (req, res) => {
  try {
    const { imagePath, audioPath, clipId, duration = 5 } = req.body;

    if (!imagePath || !audioPath) {
      return res.status(400).json({ error: 'Image and audio paths are required' });
    }

    const outputPath = `uploads/clip_${clipId}_${Date.now()}.mp4`;

    ffmpeg()
      .input(imagePath)
      .inputOptions(['-loop 1'])
      .input(audioPath)
      .outputOptions([
        '-c:v libx264',
        '-c:a aac',
        '-shortest',
        '-pix_fmt yuv420p'
      ])
      .output(outputPath)
      .on('end', () => {
        res.json({
          clipId: clipId,
          videoPath: `/${outputPath}`,
          success: true
        });
      })
      .on('error', (err) => {
        res.status(500).json({ error: err.message });
      })
      .run();

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// সমস্ত ভিডিও ক্লিপ একসাথে যুক্ত করুন
exports.mergeVideos = async (req, res) => {
  try {
    const { videoPaths, outputName = 'final_video' } = req.body;

    if (!videoPaths || videoPaths.length === 0) {
      return res.status(400).json({ error: 'Video paths are required' });
    }

    const outputPath = `uploads/${outputName}_${Date.now()}.mp4`;

    let command = ffmpeg();

    // সমস্ত ভিডিও যোগ করুন
    videoPaths.forEach(videoPath => {
      command = command.input(videoPath);
    });

    command
      .on('end', () => {
        res.json({
          videoPath: `/${outputPath}`,
          success: true,
          message: 'Video merged successfully'
        });
      })
      .on('error', (err) => {
        res.status(500).json({ error: err.message });
      })
      .mergeToFile(outputPath, 'temp/');

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};