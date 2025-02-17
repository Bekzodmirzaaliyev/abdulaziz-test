const Order = require('../models/Order');

const getOrdersAnalysis = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const matchQuery = {};

    if (startDate && endDate) {
      matchQuery.createdAt = { 
        $gte: new Date(startDate), 
        $lte: new Date(endDate) 
      };
    }

    // Agregatsiya: guruhlash oy bo'yicha
    const analysis = await Order.aggregate([
      { $match: matchQuery },
      {
        $group: {
          _id: { $month: '$createdAt' },
          totalOrders: { $sum: 1 },
          canceledOrders: {
            $sum: { $cond: [{ $eq: ['$status', 'Canceled'] }, 1, 0] },
          },
          deliveredOrders: {
            $sum: { $cond: [{ $eq: ['$status', 'Delivered'] }, 1, 0] },
          },
          revenue: {
            // Faqat yetkazib berilgan (Delivered) buyurtmalar summasi
            $sum: { $cond: [{ $eq: ['$status', 'Delivered'] }, '$total', 0] },
          },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    res.json(analysis);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getOrdersAnalysis };
