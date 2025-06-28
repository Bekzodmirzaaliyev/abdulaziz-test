const StockMovement = require('../models/StockMovement')
const mongoose = require('mongoose')
const Product = require('../models/Products');


exports.addStock = async (req, res) => {
    try {
      const { productId } = req.params;
      const { quantity } = req.body;
  
      if (!mongoose.Types.ObjectId.isValid(productId)) {
        return res.status(400).json({ message: 'Invalid product ID' });
      }
  
      const product = await Product.findById(productId);
      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }
  
      product.stock += Number(quantity); 
      await product.save();
  
      await StockMovement.create({
        product: productId,
        quantity,
        type: 'incoming', 
        note: 'Stock added via inventory API',
        createdBy: req.user?._id || null 
      });
  
      res.status(200).json({
        message: 'Stock added successfully',
        updatedStock: product.stock,
        product,
      });
    } catch (error) {
      res.status(500).json({ message: 'Error adding stock', error: error.message });
    }
  };
  