// controllers/stockReceiptController.js
const Product = require('../models/Products'); // Fixed typo: 'Products' → 'Product'
const User = require('../models/User');
const StockReceipt = require('../models/StockMovement');
const mongoose = require('mongoose');

// ➕ Create new receipt — with validation
exports.createReceipt = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { fromCompany, receivedBy, items, note } = req.body;

    // Basic validation (schema handles most constraints)
    if (!fromCompany || !receivedBy || !Array.isArray(items) || items.length === 0) {
      await session.abortTransaction();
      return res.status(400).json({ error: 'fromCompany, receivedBy, and items[] are required' });
    }

    // Validate receivedBy user
    const user = await User.findById(receivedBy).session(session);
    if (!user) {
      await session.abortTransaction();
      return res.status(400).json({ error: 'Invalid receivedBy user ID' });
    }

    // Validate items
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (!item.product || !item.quantity || !item.costPrice || !item.sellingPrice) {
        await session.abortTransaction();
        return res.status(400).json({ error: `Missing fields in item #${i + 1}` });
      }

      const product = await Product.findById(item.product).session(session);
      if (!product) {
        await session.abortTransaction();
        return res.status(400).json({ error: `Product #${i + 1} not found` });
      }
      if (!product.isActive) {
        await session.abortTransaction();
        return res.status(400).json({ error: `Product #${i + 1} is not active` });
      }
      if (item.sellingPrice < item.costPrice) {
        await session.abortTransaction();
        return res.status(400).json({ error: `Selling price is less than cost price in item #${i + 1}` });
      }
    }

    // Create receipt
    const receipt = await StockReceipt.create([{ fromCompany, receivedBy, items, note }], { session });
    await session.commitTransaction();
    res.status(201).json(receipt[0]);
  } catch (error) {
    await session.abortTransaction();
    console.error('Create receipt error:', error);
    res.status(500).json({ error: 'Failed to create receipt' });
  } finally {
    session.endSession();
  }
};

// 📄 Get all receipts
exports.getAllReceipts = async (req, res) => {
  try {
    const receipts = await StockReceipt.find()
      .populate('receivedBy', 'username')
      .populate('items.product', 'name sku'); // Populate product details
    res.json(receipts);
  } catch (error) {
    console.error('Get all receipts error:', error);
    res.status(500).json({ error: 'Failed to retrieve receipts' });
  }
};

// 🔍 Get receipt by ID
exports.getReceiptById = async (req, res) => {
  try {
    const receipt = await StockReceipt.findById(req.params.id)
      .populate('receivedBy', 'username')
      .populate('items.product', 'name sku');
    if (!receipt) return res.status(404).json({ error: 'Receipt not found' });
    res.json(receipt);
  } catch (error) {
    console.error('Get receipt by ID error:', error);
    res.status(500).json({ error: 'Failed to retrieve receipt' });
  }
};

// ❌ Delete receipt
exports.deleteReceipt = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const receipt = await StockReceipt.findById(req.params.id).session(session);
    if (!receipt) {
      await session.abortTransaction();
      return res.status(404).json({ error: 'Receipt not found' });
    }
    if (receipt.status === 'confirmed') {
      await session.abortTransaction();
      return res.status(400).json({ error: 'Cannot delete confirmed receipt' });
    }

    await StockReceipt.findByIdAndDelete(req.params.id).session(session);
    await session.commitTransaction();
    res.json({ message: 'Receipt deleted' });
  } catch (error) {
    await session.abortTransaction();
    console.error('Delete receipt error:', error);
    res.status(500).json({ error: 'Failed to delete receipt' });
  } finally {
    session.endSession();
  }
};

// ✅ Confirm receipt
exports.confirmReceipt = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const receipt = await StockReceipt.findById(req.params.id).session(session);
    if (!receipt) {
      await session.abortTransaction();
      return res.status(404).json({ error: 'Receipt not found' });
    }

    if (receipt.status === 'confirmed') {
      await session.abortTransaction();
      return res.status(400).json({ error: 'Receipt already confirmed' });
    }

    // Update product stock and create stock movements
    for (const item of receipt.items) {
      const product = await Product.findById(item.product).session(session);
      if (!product) {
        await session.abortTransaction();
        return res.status(400).json({ error: `Product ${item.product} not found` });
      }

      // Update product stock
      product.stock = (product.stock || 0) + item.quantity;
      await product.save({ session });

      // Create stock movement record
      await StockMovement.create(
        [
          {
            product: item.product,
            quantity: item.quantity,
            type: 'receipt',
            reference: receipt._id,
            referenceType: 'StockReceipt',
            createdBy: receipt.receivedBy,
          },
        ],
        { session }
      );
    }

    // Update receipt status
    receipt.status = 'confirmed';
    await receipt.save({ session });

    await session.commitTransaction();
    res.json({ message: 'Receipt confirmed', receipt });
  } catch (error) {
    await session.abortTransaction();
    console.error('Confirm receipt error:', error);
    res.status(500).json({ error: 'Failed to confirm receipt' });
  } finally {
    session.endSession();
  }
};