// Analytics Routes
const express = require('express');
const router = express.Router();
const { getPopularDishes, getOrderStats, getRevenueSummary } = require('../controllers/analyticsController');
const { protect, admin } = require('../middleware/auth');

router.get('/popular', getPopularDishes);
router.get('/orders', protect, admin, getOrderStats);
router.get('/revenue', protect, admin, getRevenueSummary);

module.exports = router;
