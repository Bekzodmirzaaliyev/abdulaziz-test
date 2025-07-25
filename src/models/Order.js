const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product', // Reference to Product model (assumed to exist)
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
    age: {
      type: Number,
      required: true,
    },
    street: {
      type: String,
      required: true,
      trim: true,
    }, 
    image: {
      type: String,
      required: true,
      default: 'https://png.pngtree.com/png-clipart/20210310/original/pngtree-25d-cosmetics-feminine-products-png-image_5925278.jpg', 
    }
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Reference to User model
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
      address: { type: String, trim: true, required: true },
      contactNumber: { type: String, trim: true, required: true },
      instructions: { type: String, trim: true },
      coordinates: {
        lat: { type: Number },
        lon: { type: Number },
      },
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt
  }
);

// Update updatedAt before saving
orderSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Order', orderSchema);