const gameService = require('../services/gameService');

const gameController = {
  // Save progress for any game
  saveProgress: async (req, res) => {
    try {
      const { childId, gameId, score, pointsEarned, level, movesUsed, timeSpent, metadata } = req.body;
      
      // Validate required fields
      if (!childId || !gameId) {
        return res.status(400).json({ 
          success: false, 
          error: 'Missing required fields: childId, gameId' 
        });
      }
      
      const result = await gameService.saveProgress({
        childId,
        gameId,
        score,
        pointsEarned,
        level,
        movesUsed,
        timeSpent,
        metadata
      });
      
      res.json({ success: true, ...result });
      
    } catch (error) {
      console.error('Error in saveProgress controller:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  },
  
  // Get all games progress for a child
  getAllProgress: async (req, res) => {
    try {
      const { childId } = req.params;
      
      const result = await gameService.getAllGamesProgress(childId);
      
      res.json({ success: true, ...result });
      
    } catch (error) {
      console.error('Error in getAllProgress controller:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  },
  
  // Get specific game progress
  getGameProgress: async (req, res) => {
    try {
      const { childId, gameId } = req.params;
      
      const result = await gameService.getGameProgress(childId, gameId);
      
      res.json({ success: true, ...result });
      
    } catch (error) {
      console.error('Error in getGameProgress controller:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  },
  
  // Get child's total stats
  getChildStats: async (req, res) => {
    try {
      const { childId } = req.params;
      
      const result = await gameService.getChildStats(childId);
      
      res.json({ success: true, ...result });
      
    } catch (error) {
      console.error('Error in getChildStats controller:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  },
  
  // Get leaderboard
  getLeaderboard: async (req, res) => {
    try {
      const { gameId } = req.params;
      const { limit = 10 } = req.query;
      
      const result = await gameService.getLeaderboard(gameId, parseInt(limit));
      
      res.json({ success: true, ...result });
      
    } catch (error) {
      console.error('Error in getLeaderboard controller:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  },
  
  // Award badge
  awardBadge: async (req, res) => {
    try {
      const { childId, badgeName, source } = req.body;
      
      const result = await gameService.awardBadge(childId, badgeName, source);
      
      res.json({ success: true, ...result });
      
    } catch (error) {
      console.error('Error in awardBadge controller:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  }
};

module.exports = gameController;