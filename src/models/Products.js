// models/Product.js
const mongoose = require("mongoose");

// Субдокумент для комментариев с рейтингом
const commentSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    text: { type: String, required: true, trim: true },
    rating: { type: Number, required: true, min: 0, max: 5 },
    date: { type: Date, default: Date.now },
  },
  { _id: false }
);

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      validate: {
        validator: async function (value) {
          const user = await mongoose.model("User").findById(value);
          return user && user.role === "seller";
        },
        message: "Only sellers can be assigned as product owners",
      },
    },
    price: {
      costPrice: { type: Number, required: true, min: 0 },
      sellingPrice: { type: Number, required: true, min: 0 },
      income: { type: Number, default: 0 },
    },
    stock: { type: Number, required: true, min: 0 },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    view: { type: Number, default: 0 },
    comments: [commentSchema],
    images: [{ type: String }],
    description: { type: String },
    tags: [{ type: String }],
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

// Вычисляем прибыль и общий рейтинг перед сохранением
productSchema.pre("save", function (next) {
  // Income calculation
  this.price.income = this.price.sellingPrice - this.price.costPrice;

  // Average rating from comments
  if (Array.isArray(this.comments) && this.comments.length > 0) {
    const total = this.comments.reduce((sum, c) => sum + c.rating, 0);
    this.rating = Math.round((total / this.comments.length) * 100) / 100; // округление до 2 знаков
  } else {
    this.rating = 0;
  }

  next();
});

module.exports = mongoose.model("Product", productSchema);
