const express = require('express');
const router = express.Router();
const gameController = require('../controllers/gameController');

// ============================================
// GAME PROGRESS ROUTES
// ============================================

// Save progress for any game
router.post('/progress', gameController.saveProgress);

// Get all games progress for a child
router.get('/progress/:childId', gameController.getAllProgress);

// Get specific game progress
router.get('/progress/:childId/:gameId', gameController.getGameProgress);

// Get child's total stats (XP, streak, badges)
router.get('/stats/:childId', gameController.getChildStats);

// Get leaderboard for a specific game
router.get('/leaderboard/:gameId', gameController.getLeaderboard);

// Award badge manually (for special achievements)
router.post('/badge', gameController.awardBadge);

module.exports = router;