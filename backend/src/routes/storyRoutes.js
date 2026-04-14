const express = require('express');
const router = express.Router();
const storyController = require('../controllers/storyController');
const { protect } = require('../middlewares/authMiddleware');

// Route to create a new story
router.post('/generate', protect, storyController.createStory);

// Route to get all previous stories for a specific child
router.get('/library/:childId', protect, storyController.getLibrary);

module.exports = router;