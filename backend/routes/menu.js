// Menu Routes
const express = require('express');
const router = express.Router();
const {
  getMenuItems, getMenuItem, createMenuItem,
  updateMenuItem, deleteMenuItem, getCategories,
} = require('../controllers/menuController');
const { protect, admin } = require('../middleware/auth');

// Public routes
router.get('/categories/list', getCategories);
router.route('/').get(getMenuItems).post(protect, admin, createMenuItem);
router.route('/:id').get(getMenuItem).put(protect, admin, updateMenuItem).delete(protect, admin, deleteMenuItem);

module.exports = router;
