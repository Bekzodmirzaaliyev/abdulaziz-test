// controllers/invoiceController.js
const mongoose = require('mongoose');
const Invoice = require('../models/Invoice'); // siz yaratgan model fayli
const Product = require('../models/Products'); // stock maydoni shu modelda

// 🧮 Helper: bir xil formatga keltirish
const normalizeItems = (items = []) =>
  items.map((it) => ({
    product: new mongoose.Types.ObjectId(String(it.product)),
    quantity: Number(it.quantity),
    costPrice: Number(it.costPrice ?? 0),
    salePrice: Number(it.salePrice ?? 0),
    uom: it.uom || 'pcs',
  }));

// 🧮 Helper: stokni qo'llash (incoming -> +, outgoing -> -)
async function applyStock(session, type, items, { revert = false } = {}) {
  const incSign = (type === 'incoming' ? 1 : -1) * (revert ? -1 : 1);

  // Avval hamma product’lar mavjudligini va yetarli stok borligini tekshiramiz (outgoing)
  const ids = items.map((i) => i.product);
  const products = await Product.find({ _id: { $in: ids } })
    .select('_id stock')
    .session(session);

  const byId = new Map(products.map((p) => [String(p._id), p]));
  for (const item of items) {
    const p = byId.get(String(item.product));
    if (!p) {
      throw new Error(`Product not found: ${item.product}`);
    }
    const delta = incSign * item.quantity;
    if (p.stock + delta < 0) {
      throw new Error(
        `Insufficient stock for product ${item.product}. Available=${p.stock}, required=${-delta}`
      );
    }
  }

  // bulkWrite bilan tezkor yangilash
  const ops = items.map((i) => ({
    updateOne: {
      filter: { _id: i.product },
      update: { $inc: { stock: incSign * i.quantity } },
    },
  }));
  if (ops.length) {
    await Product.bulkWrite(ops, { session });
  }
}

// 📌 CREATE
exports.createInvoice = async (req, res) => {
  const session = await mongoose.startSession();
  try {
    const { type, product: items, comingPlace, note } = req.body;

    if (!type || !['incoming', 'outgoing'].includes(type)) {
      return res.status(400).json({ message: "type must be 'incoming' or 'outgoing'" });
    }
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: 'product (items) is required and cannot be empty' });
    }

    const norm = normalizeItems(items);

    await session.withTransaction(async () => {
      // 1) Stokni qo'llash
      await applyStock(session, type, norm);

      // 2) Invoice yaratish (total model pre-save’da ham, bu yerda ham xavfsizlik uchun hisoblaymiz)
      const total = norm.reduce((s, it) => s + it.salePrice * it.quantity, 0);

      const invoice = await Invoice.create(
        [
          {
            type,
            comingPlace: comingPlace || '',
            note: note || '',
            product: norm,
            createdBy: req.user?._id, // protect ishlatilsa keladi
            total,
          },
        ],
        { session }
      );

      res.status(201).json(invoice[0]);
    });
  } catch (e) {
    await session.abortTransaction();
    res.status(400).json({ message: e.message });
  } finally {
    session.endSession();
  }
};

// 📌 GET ALL (pagination + filter)
exports.getInvoices = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      type,
      createdBy,
      from,
      to,
      search, // comingPlace yoki note bo‘yicha
    } = req.query;

    const q = {};
    if (type && ['incoming', 'outgoing'].includes(type)) q.type = type;
    if (createdBy) q.createdBy = createdBy;
    if (from || to) {
      q.createdAt = {};
      if (from) q.createdAt.$gte = new Date(from);
      if (to) q.createdAt.$lte = new Date(to);
    }
    if (search) {
      q.$or = [
        { comingPlace: { $regex: search, $options: 'i' } },
        { note: { $regex: search, $options: 'i' } },
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);

    const [items, total] = await Promise.all([
      Invoice.find(q)
        .populate('createdBy', 'username email')
        .populate('product.product', 'name stock price')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
      Invoice.countDocuments(q),
    ]);

    res.json({
      data: items,
      page: Number(page),
      limit: Number(limit),
      total,
      pages: Math.ceil(total / Number(limit)),
    });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

// 📌 GET BY ID
exports.getInvoiceById = async (req, res) => {
  try {
    const inv = await Invoice.findById(req.params.id)
      .populate('createdBy', 'username email')
      .populate('product.product', 'name stock price');
    if (!inv) return res.status(404).json({ message: 'Invoice not found' });
    res.json(inv);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

// 📌 UPDATE (eski effektni qaytarib, yangisini qo'llash)
exports.updateInvoice = async (req, res) => {
  const session = await mongoose.startSession();
  try {
    const id = req.params.id;
    const { type, product: items, comingPlace, note } = req.body;

    const current = await Invoice.findById(id).session(session);
    if (!current) return res.status(404).json({ message: 'Invoice not found' });

    // Agar mahsulotlar yoki type o‘zgarsa, stokni qayta hisoblaymiz
    const newType = type || current.type;
    const newItems = Array.isArray(items) ? normalizeItems(items) : current.product;

    await session.withTransaction(async () => {
      // 1) Eski effektni bekor qilish (revert = true)
      await applyStock(session, current.type, current.product, { revert: true });

      // 2) Yangi effektni qo'llash
      await applyStock(session, newType, newItems, { revert: false });

      // 3) Invoice’ni yangilash
      const total = newItems.reduce((s, it) => s + it.salePrice * it.quantity, 0);

      current.type = newType;
      current.product = newItems;
      if (comingPlace !== undefined) current.comingPlace = comingPlace;
      if (note !== undefined) current.note = note;
      current.total = total;
      current.createdBy = current.createdBy || req.user?._id;

      await current.save({ session });

      const populated = await Invoice.findById(id)
        .populate('createdBy', 'username email')
        .populate('product.product', 'name stock price')
        .session(session);

      res.json(populated);
    });
  } catch (e) {
    await session.abortTransaction();
    res.status(400).json({ message: e.message });
  } finally {
    session.endSession();
  }
};

// 📌 DELETE (eski effektni qaytarish)
exports.deleteInvoice = async (req, res) => {
  const session = await mongoose.startSession();
  try {
    const id = req.params.id;
    const current = await Invoice.findById(id).session(session);
    if (!current) return res.status(404).json({ message: 'Invoice not found' });

    await session.withTransaction(async () => {
      // 1) Stokni revert
      await applyStock(session, current.type, current.product, { revert: true });

      // 2) O‘chirish
      await Invoice.deleteOne({ _id: id }, { session });

      res.json({ message: 'Invoice deleted' });
    });
  } catch (e) {
    await session.abortTransaction();
    res.status(500).json({ message: e.message });
  } finally {
    session.endSession();
  }
};
