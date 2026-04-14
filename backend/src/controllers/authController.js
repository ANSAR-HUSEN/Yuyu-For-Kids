const authService = require('../services/authService');

const register = async (req, res) => {
  try {
    const { email, password } = req.body;
    const parent = await authService.registerParent(email, password);
    res.status(201).json({ message: "Parent registered successfully", parentId: parent.id });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await authService.loginParent(email, password);
    res.status(200).json(result);
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
};

module.exports = { register, login };