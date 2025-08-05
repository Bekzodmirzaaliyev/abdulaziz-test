const mongoose = require('mongoose');

const CommonSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  quantity: { type: Number, required: true },
  costPrice: { type: Number, required: true },
  salePrice: { type: Number, required: true },
  source: { type: String, required: true },
  addedBy: { type: String, default: 'admin' },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Common', CommonSchema);
