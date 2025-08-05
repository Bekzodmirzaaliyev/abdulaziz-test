const StockMovement = require('../models/Common');
const Product = require('../models/Products');

exports.addStock = async (req, res) => {
  try {
    console.log('Incoming request body:', req.body);

    const { product, quantity, costPrice, salePrice, source,  createdBy } = req.body;

    const newStockMovment = new StockMovement({
      product,
      quantity,
      costPrice,
      salePrice,
      source,
    });

    await newStockMovment.save();
    console.log('StockMovement saved');

    const existingProduct = await Product.findById(product);
    if (existingProduct) {
      console.log('Product found:', existingProduct.name);
      existingProduct.stock += quantity;
      await existingProduct.save();
    } else {
      console.log('Product not found');
    }

    res.status(201).json({ message: 'Stock added successfully', data: newStockMovment });
  } catch (error) {
    console.error('❌ Error in addStock:', error);
    res.status(500).json({ message: 'Something went wrong', error });
  }
};

  

  exports.getAllStocks = async (req, res) => {
    try {
      const stocks = await StockMovement.find()
        .populate('product', 'name')
        .sort({ createdAt: -1 });
  
      res.status(200).json(stocks);
    } catch (err) {
      res.status(500).json({ message: "Server error", error: err });
    }
  };
  