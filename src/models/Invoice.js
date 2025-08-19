// models/Invoice.js
const mongoose = require('mongoose');

const InvoiceSchema = new mongoose.Schema(
  {
    product: [
      {
        quantity: { type: Number, required: true, min: 1 },
        costPrice: { type: Number, required: true, min: 0 },
        salePrice: { type: Number, required: true, min: 0 },
        uom: { type: String, default: 'pcs' },
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product',
          required: true,
        },
      },
    ],
    comingPlace: {
      type: String,
      trim: true,
    },
    type: {
      type: String,
      enum: ['incoming', 'outgoing'], // kirim yoki chiqim
      required: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    note: {
      type: String,
      trim: true,
    },
    total: {
      type: Number,
      min: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Avtomatik umumiy summani hisoblash
InvoiceSchema.pre('save', function (next) {
  if (this.product && this.product.length > 0) {
    this.total = this.product.reduce(
      (sum, item) => sum + item.salePrice * item.quantity,
      0
    );
  }
  next();
});

module.exports = mongoose.model('Invoice', InvoiceSchema);
