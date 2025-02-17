const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select('-password');
      return next();
    } catch (error) {
      console.error('Token xatosi:', error);
      return res.status(401).json({ message: 'Noto\'g\'ri token' });
    }
  }
  if (!token) {
    return res.status(401).json({ message: 'Token topilmadi' });
  }
};

const admin = (req, res, next) => {
  // CEO: admin dashboardga to'liq kirish (yoki siz istagan rolni)
  if (req.user && req.user.role === 'CEO') {
    return next();
  }
  return res.status(403).json({ message: 'Admin (CEO) huquqi talab etiladi' });
};

const cashier = (req, res, next) => {
  if (req.user && req.user.role === 'Cashier') {
    return next();
  }
  return res.status(403).json({ message: 'Cashier huquqi talab etiladi' });
};

const delivery = (req, res, next) => {
  if (req.user && req.user.role === 'delivery') {
    return next();
  }
  return res.status(403).json({ message: 'Delivery huquqi talab etiladi' });
};

const chief = (req, res, next) => {
  if (req.user && req.user.role === 'chief') {
    return next();
  }
  return res.status(403).json({ message: 'Chief huquqi talab etiladi' });
};

const customer = (req, res, next) => {
  if (req.user && req.user.role === 'customer') {
    return next();
  }
  return res.status(403).json({ message: 'Customer huquqi talab etiladi' });
};

module.exports = { protect, admin, cashier, delivery, chief, customer };
