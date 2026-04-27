const authService = require('../services/authService');

const register = async (req, res) => {
  try {
    const { email, password, name } = req.body;  
    
    console.log("Received registration:", { email, name }); 
    
    const parent = await authService.registerParent(email, password, name); 
    
    res.status(201).json({ 
      message: "Parent registered successfully", 
      parentId: parent.id,
      name: parent.name 
    });
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

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const result = await authService.forgotPassword(email);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;
    const result = await authService.resetPassword(token, password);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = { register, login, forgotPassword, resetPassword };