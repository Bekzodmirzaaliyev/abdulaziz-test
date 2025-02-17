const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product', // agar product modelingiz bo'lsa
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    // Qo'shimcha maydonlar (masalan, special instructions)
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // buyurtmani qaysi foydalanuvchi berganini belgilaydi
      required: true,
    },
    items: [orderItemSchema],
    total: {
      type: Number,
      required: true,
      min: 0,
    },
    status: {
      type: String,
      enum: ['Pending', 'Processing', 'Preparing', 'Delivered', 'Canceled'],
      default: 'Pending',
    },
    paymentMethod: {
      type: String,
      enum: ['Cash', 'Card', 'Online'],
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ['Pending', 'Paid', 'Failed'],
      default: 'Pending',
    },
    deliveryDetails: {
      address: { type: String, trim: true },
      contactNumber: { type: String, trim: true },
      instructions: { type: String, trim: true },
    },
  },
  {
    timestamps: true, // avtomatik tarzda createdAt va updatedAt qo'shadi
  }
);

// Agar qo'shimcha pre-save logikasi kerak bo'lsa, quyidagi middleware-dan foydalaning
orderSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Order', orderSchema);
