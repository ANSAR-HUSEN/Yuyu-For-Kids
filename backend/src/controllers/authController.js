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
    
    res.status(200).json({
      token: result.token,
      parentId: result.parent.id,
      name: result.parent.name,
      email: result.parent.email,  
      parent: result.parent
    });
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
const getProfile = async (req, res) => {
  try {
    const parentId = req.parent.id; 
    const parent = await authService.getParentProfile(parentId);
    res.status(200).json({ 
      id: parent.id,
      name: parent.name,
      email: parent.email,
      createdAt: parent.createdAt
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
const updateProfile = async (req, res) => {
  try {
    const parentId = req.parent.id;
    const { name } = req.body;
    
    if (!name) {
      return res.status(400).json({ error: 'Name is required' });
    }
    
    const updatedParent = await authService.updateParentProfile(parentId, name);
    
    res.status(200).json({ 
      message: 'Profile updated successfully',
      id: updatedParent.id,
      name: updatedParent.name,
      email: updatedParent.email
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
module.exports = { register, login, forgotPassword, resetPassword, getProfile, updateProfile };
