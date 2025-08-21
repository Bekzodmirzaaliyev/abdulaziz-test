// src/controllers/inventorController.js
const StockMovement = require('../models/StockMovement');
const mongoose = require('mongoose');
const Product = require('../models/Products');

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

/**
 * Add stock to a specific product by ID
 */
exports.addStock = async (req, res) => {
  try {
    const { productId } = req.params;
    const { quantity, notes } = req.body;

    console.log('🔍 Add stock request:', { productId, quantity, notes });

    // Validation
    if (!isValidObjectId(productId)) {
      return res.status(400).json({ 
        message: 'Invalid product ID format',
        productId 
      });
    }

    if (!quantity || quantity <= 0) {
      return res.status(400).json({ 
        message: 'Quantity must be a positive number',
        received: quantity 
      });
    }

    // Find product
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ 
        message: 'Product not found',
        productId 
      });
    }

    console.log('📦 Product found:', product.name);

    // Update product stock
    const oldStock = product.stock;
    product.stock += Number(quantity);
    await product.save();

    console.log(`📈 Stock updated: ${oldStock} → ${product.stock}`);

    // Create stock movement record
    const stockMovement = await StockMovement.create({
      product: productId,
      quantity: Number(quantity),
      type: 'incoming',
      note: notes || 'Stock added via inventory API',
      createdBy: req.user?._id || null
    });

    console.log('✅ Stock movement created:', stockMovement._id);

    res.status(200).json({
      message: 'Stock added successfully',
      updatedStock: product.stock,
      previousStock: oldStock,
      addedQuantity: Number(quantity),
      product: {
        _id: product._id,
        name: product.name,
        stock: product.stock
      },
      stockMovement: {
        _id: stockMovement._id,
        type: stockMovement.type,
        quantity: stockMovement.quantity,
        createdAt: stockMovement.createdAt
      }
    });

  } catch (error) {
    console.error('❌ Error in addStock:', error);
    res.status(500).json({ 
      message: 'Error adding stock', 
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};