const Order = require('../models/Order');

// 1. Buyurtma yaratish
const createOrder = async (req, res) => {
  try {
    const { items, total, paymentMethod, deliveryDetails } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: 'Order items cannot be empty' });
    }

    const order = new Order({
      user: req.user._id,
      items,
      total,
      paymentMethod,
      deliveryDetails,
    });

    const createdOrder = await order.save();
    res.status(201).json(createdOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 2. Buyurtma yangilash
const updateOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    const { items, total, status, paymentMethod, deliveryDetails } = req.body;
    if (items) order.items = items;
    if (total !== undefined) order.total = total;
    if (status) order.status = status;
    if (paymentMethod) order.paymentMethod = paymentMethod;
    if (deliveryDetails) order.deliveryDetails = deliveryDetails;

    order.updatedAt = Date.now();
    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 3. Bir nechta buyurtmalarni o'chirish (id lar array orqali)
const deleteOrders = async (req, res) => {
  try {
    const { ids } = req.body; // { ids: ['id1', 'id2', ...] }
    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ message: 'Please provide an array of order ids to delete' });
    }
    await Order.deleteMany({ _id: { $in: ids } });
    res.json({ message: 'Orders deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 4. Barcha buyurtmalarni ko'rish
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate('user', 'username email');
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createOrder, updateOrder, deleteOrders, getAllOrders };
