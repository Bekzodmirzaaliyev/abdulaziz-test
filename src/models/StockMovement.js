// src/models/StockMovement.js
const mongoose = require('mongoose');

const stockMovementSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 0
  },
  type: {
    type: String,
    enum: ['incoming', 'outgoing', 'adjustment'],
    default: 'incoming'
  },
  costPrice: {
    type: Number,
    min: 0
  },
  salePrice: {
    type: Number,
    min: 0
  },
  source: {
    type: String,
    trim: true
  },
  note: {
    type: String,
    trim: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  // Qo'shimcha maydonlar
  batchNumber: {
    type: String,
    trim: true
  },
  expiryDate: {
    type: Date
  },
  supplier: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

// Index'lar
stockMovementSchema.index({ product: 1, createdAt: -1 });
stockMovementSchema.index({ type: 1 });
stockMovementSchema.index({ createdBy: 1 });

module.exports = mongoose.model('StockMovement', stockMovementSchema);