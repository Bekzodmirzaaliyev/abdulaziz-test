const mongoose = require('mongoose');

const stockReceiptItemSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
    costPrice: {
      type: Number,
      required: true,
      min: 0,
    },
    sellingPrice: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  { _id: false }
);

const stockReceiptSchema = new mongoose.Schema({
  fromCompany: {
    type: String,
    required: true,
    trim: true,
  },
  receivedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  items: {
    type: [stockReceiptItemSchema],
    validate: {
      validator: function (val) {
        return Array.isArray(val) && val.length > 0;
      },
      message: 'At least one product item must be provided',
    },
  },
  note: {
    type: String,
    default: '',
  },
  status: {
    type: String,
    enum: ['draft', 'confirmed'],
    default: 'confirmed',
  },
  totalQuantity: {
    type: Number,
    default: 0,
    min: 0,
  },
  totalAmount: {
    type: Number,
    default: 0,
    min: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// 🧠 Автоматик ҳисоблаш хук
stockReceiptSchema.pre('validate', function (next) {
  if (this.items?.length > 0) {
    this.totalQuantity = this.items.reduce(
      (sum, item) => sum + item.quantity,
      0
    );
    this.totalAmount = this.items.reduce(
      (sum, item) => sum + item.costPrice * item.quantity,
      0
    );
  } else {
    this.totalQuantity = 0;
    this.totalAmount = 0;
  }
  next();
});

module.exports = mongoose.model('StockReceipt', stockReceiptSchema);
  