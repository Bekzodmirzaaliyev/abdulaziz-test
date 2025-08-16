// src/controllers/addStock.js
const StockMovement = require('../models/StockMovement'); // To'g'ri model import qiling
const Product = require('../models/Products');

exports.addStock = async (req, res) => {
  try {
    console.log('Incoming request body:', req.body);

    const { product, quantity, costPrice, salePrice, source, createdBy } = req.body;

    // Validatsiya
    if (!product || !quantity || !costPrice || !salePrice || !source) {
      return res.status(400).json({ 
        message: 'Missing required fields: product, quantity, costPrice, salePrice, source' 
      });
    }

    // StockMovement yaratish
    const newStockMovement = new StockMovement({
      product,
      quantity: Number(quantity),
      costPrice: Number(costPrice),
      salePrice: Number(salePrice),
      source,
      type: 'incoming', // incoming type qo'shish
      createdBy: createdBy || null
    });

    await newStockMovement.save();
    console.log('StockMovement saved:', newStockMovement);

    // Product stock yangilash
    const existingProduct = await Product.findById(product);
    if (existingProduct) {
      console.log('Product found:', existingProduct.name);
      existingProduct.stock += Number(quantity);
      
      // Agar narxlar yangilansa
      if (costPrice) {
        existingProduct.price.costPrice = Number(costPrice);
      }
      if (salePrice) {
        existingProduct.price.sellingPrice = Number(salePrice);
        existingProduct.price.income = Number(salePrice) - Number(costPrice);
      }
      
      await existingProduct.save();
      console.log('Product stock updated:', existingProduct.stock);
    } else {
      console.log('Product not found with ID:', product);
      return res.status(404).json({ message: 'Product not found' });
    }

    res.status(201).json({ 
      message: 'Stock added successfully', 
      data: newStockMovement,
      updatedProduct: existingProduct
    });
  } catch (error) {
    console.error('❌ Error in addStock:', error);
    res.status(500).json({ 
      message: 'Something went wrong', 
      error: error.message 
    });
  }
};

// Simple stock qo'shish (faqat quantity uchun)
exports.addSimpleStock = async (req, res) => {
  try {
    const { productId } = req.params;
    const { quantity, notes } = req.body;

    if (!quantity || quantity <= 0) {
      return res.status(400).json({ message: 'Valid quantity is required' });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Stock yangilash
    product.stock += Number(quantity);
    await product.save();

    // StockMovement yozish
    await StockMovement.create({
      product: productId,
      quantity: Number(quantity),
      type: 'incoming',
      note: notes || 'Stock added via inventory',
      createdBy: req.user?._id || null
    });

    res.status(200).json({
      message: 'Stock added successfully',
      updatedStock: product.stock,
      product
    });
  } catch (error) {
    console.error('❌ Error in addSimpleStock:', error);
    res.status(500).json({ 
      message: 'Error adding stock', 
      error: error.message 
    });
  }
};

exports.getAllStocks = async (req, res) => {
  try {
    const stocks = await StockMovement.find()
      .populate('product', 'name images category')
      .populate('createdBy', 'username')
      .sort({ createdAt: -1 });

    res.status(200).json(stocks);
  } catch (err) {
    console.error('❌ Error getting stocks:', err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};