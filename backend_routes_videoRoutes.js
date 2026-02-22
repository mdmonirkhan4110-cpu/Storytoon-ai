const express = require('express');
const videoController = require('../controllers/videoController');

const router = express.Router();

router.post('/generate-speech', videoController.generateSpeech);
router.post('/create-clip', videoController.createVideoClip);
router.post('/merge', videoController.mergeVideos);

module.exports = router;