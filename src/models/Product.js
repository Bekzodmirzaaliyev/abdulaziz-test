const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
  price: { type: Number, required: true },
  quantity: { type: Number, default: 0 },
  description: String,
  image: String,
});

module.exports = mongoose.models.Product || mongoose.model('Product', productSchema);