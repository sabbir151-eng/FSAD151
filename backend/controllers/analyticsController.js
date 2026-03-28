// ============================================
// Analytics Controller - Reports & Insights
// ============================================
const Order = require('../models/Order');
const MenuItem = require('../models/MenuItem');

// @desc    Get most popular dishes (by order count)
// @route   GET /api/analytics/popular
exports.getPopularDishes = async (req, res) => {
  try {
    const limit = Number(req.query.limit) || 10;
    const popularItems = await MenuItem.find()
      .sort({ orderCount: -1 })
      .limit(limit)
      .select('name category price orderCount image rating');

    res.json(popularItems);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get order statistics (by period)
// @route   GET /api/analytics/orders
exports.getOrderStats = async (req, res) => {
  try {
    const { period = 'week' } = req.query;

    let dateFilter = new Date();
    if (period === 'week') dateFilter.setDate(dateFilter.getDate() - 7);
    else if (period === 'month') dateFilter.setMonth(dateFilter.getMonth() - 1);
    else if (period === 'year') dateFilter.setFullYear(dateFilter.getFullYear() - 1);

    // Orders grouped by status
    const statusStats = await Order.aggregate([
      { $match: { createdAt: { $gte: dateFilter } } },
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]);

    // Daily order count + revenue
    const dailyOrders = await Order.aggregate([
      { $match: { createdAt: { $gte: dateFilter } } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          count: { $sum: 1 },
          revenue: { $sum: '$totalPrice' },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Totals
    const totalOrders = await Order.countDocuments({ createdAt: { $gte: dateFilter } });
    const totalRevenue = await Order.aggregate([
      { $match: { createdAt: { $gte: dateFilter }, status: { $ne: 'Cancelled' } } },
      { $group: { _id: null, total: { $sum: '$totalPrice' } } },
    ]);

    res.json({
      statusStats,
      dailyOrders,
      totalOrders,
      totalRevenue: totalRevenue[0]?.total || 0,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get monthly revenue summary
// @route   GET /api/analytics/revenue
exports.getRevenueSummary = async (req, res) => {
  try {
    const monthlyRevenue = await Order.aggregate([
      { $match: { status: { $ne: 'Cancelled' } } },
      {
        $group: {
          _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } },
          revenue: { $sum: '$totalPrice' },
          orderCount: { $sum: 1 },
        },
      },
      { $sort: { '_id.year': -1, '_id.month': -1 } },
      { $limit: 12 },
    ]);

    res.json(monthlyRevenue);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
