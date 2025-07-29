const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    type: {
      type: String,
      enum: ['percent', 'fixed'],
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      min: [0, 'Amount 0 dan kichik bo‘lishi mumkin emas'],
    },
    usageLimit: {
      type: Number,
      default: 1,
      min: [0, 'Usage limit 0 dan kichik bo‘lishi mumkin emas'],
    },
    usedCount: {
      type: Number,
      default: 0,
      min: [0, 'Used count 0 dan kichik bo‘lishi mumkin emas'],
    },
    image: String,
    expiresAt: Date,
  },
  { timestamps: true }
);

module.exports = mongoose.model('Coupon', couponSchema);
