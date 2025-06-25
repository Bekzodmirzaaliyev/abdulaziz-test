const StockMovement = require('../models/Common');
const Product = require('../models/Products');

exports.addStock = async (req, res) => {
    try {
      const { product, quantity, costPrice, salePrice, source, addedBy, createdBy } = req.body;
  
      const newStockMovment = new StockMovement({
        product,
        quantity,
        costPrice,
        salePrice,
        source,
        addedBy,
        createdBy
      });
  
      await newStockMovment.save();
  
      const existingProduct = await Product.findById(product);
      if (existingProduct) {
        existingProduct.stock += quantity;
        await existingProduct.save();
      }
  
      res.status(201).json({ message: 'Stock added successfully', data: newStockMovment });
    } catch (error) {
      console.error(error);
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
  