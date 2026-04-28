const express = require('express');
const router = express.Router();
const childController = require('../controllers/childController');
const { protect } = require('../middlewares/authMiddleware');

router.post('/', protect, childController.addChild);
router.get('/', protect, childController.getChildren);
router.put('/:id', protect, childController.updateChild);
router.delete('/:id', protect, childController.deleteChild);

module.exports = router;