const express = require('express');
const scriptController = require('../controllers/scriptController');

const router = express.Router();

router.post('/split', scriptController.splitScript);
router.post('/generate-image', scriptController.generateImage);

module.exports = router;