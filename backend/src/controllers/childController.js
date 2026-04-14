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

module.exports = { addChild, getChildren };