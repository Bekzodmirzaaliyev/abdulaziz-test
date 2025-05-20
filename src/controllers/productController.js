const Product = require('../models/Products');
const User = require('../models/User');

exports.createProduct = async (req, res) => {
  try {
    const { name, category, seller, stock, price } = req.body;

    if (!name || !category || !seller || !stock || !price) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const user = await User.findById(seller);
    if (!user || user.role !== 'seller') {
      return res.status(400).json({ error: 'Invalid seller' });
    }

    const product = new Product(req.body);
    const savedProduct = await product.save();
    const populatedProduct = await savedProduct.populate('category seller');

    res.status(201).json(populatedProduct);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getAllProducts = async (req, res) => {
  try {
    const { search, sortBy, category, limit = 20, page = 1 } = req.query;
    const query = {};

    if (search) query.name = { $regex: search, $options: 'i' };
    if (category) query.category = category;

    const products = await Product.find(query)
      .populate('category seller comments.user')
      .sort(sortBy ? { [sortBy]: 1 } : {})
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate(
      'category seller comments.user'
    );
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(product);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
