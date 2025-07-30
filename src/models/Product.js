const moongoose = require('mongoose');

const productSchema = new moongoose.Schema({
    name: { type: String, required: true }, 
    category: { type: moongoose.Schema.Types.ObjectId, ref: 'Category', },
    price: { type: Number, required: true }, 
    quantity: { type: Number, required: true }
})

module.exports = moongoose.model('Product', productSchema);