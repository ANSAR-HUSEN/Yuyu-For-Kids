const childService = require('../services/childService');

const addChild = async (req, res) => {
  try {
    const child = await childService.createChild(req.parent.id, req.body);
    res.status(201).json(child);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getChildren = async (req, res) => {
  try {
    const children = await childService.getChildrenByParent(req.parent.id);
    res.status(200).json(children);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const updateChild = async (req, res) => {
  try {
    const { id } = req.params;
    const child = await childService.updateChild(id, req.body, req.parent.id);
    res.status(200).json(child);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const updateChildStats = async (req, res) => {
  try {
    const { id } = req.params;
    const child = await childService.updateChildStats(id, req.body, req.parent.id);
    res.status(200).json(child);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const incrementGamesPlayed = async (req, res) => {
  try {
    const { id } = req.params;
    const child = await childService.incrementGamesPlayed(id, req.parent.id);
    res.status(200).json(child);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const updateGameStats = async (req, res) => {
  try {
    const { id } = req.params;
    const { score } = req.body;
    const child = await childService.updateGameStats(id, score, req.parent.id);
    res.status(200).json(child);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const deleteChild = async (req, res) => {
  try {
    const { id } = req.params;
    await childService.deleteChild(id, req.parent.id);
    res.status(200).json({ message: 'Child deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = { 
  addChild, 
  getChildren, 
  updateChild, 
  updateChildStats,
  incrementGamesPlayed,
  updateGameStats,
  deleteChild 
};