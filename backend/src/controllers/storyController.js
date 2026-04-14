const aiService = require('../services/aiService');

const createStory = async (req, res) => {
  try {
    const { childId, topic } = req.body;
    const storyEntry = await aiService.generateStory(childId, topic);
    res.status(200).json(storyEntry);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getLibrary = async (req, res) => {
  try {
    const { childId } = req.params;
    const history = await aiService.getStoryHistory(childId);
    res.status(200).json(history);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { createStory, getLibrary };