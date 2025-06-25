const { default: mongoose } = require('mongoose');
const moongoose = require('mongoose');

const CommonSchema = new moongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Products',
    required: true,
  },
  quantity: { type: Number, required: true },
  costPrice: { type: Number, required: true }, 
  salePrice: { type: Number, required: true }, 
  source: { type: String, required: true }, 
  addedBy: { type: String, default: 'admin' }, 
  createdAt: { type: Date, default: Date.now },
});

module.exports = moongoose.model('Common', CommonSchema);
