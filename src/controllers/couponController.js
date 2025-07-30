const Coupon = require('../models/Coupon');
const Product = require('../models/Products');
exports.createCoupon = async (req, res) => {
  try {
    const { code, type, amount, usageLimit, image, validDays, usedCount } =
      req.body;

    // ❗️Manfiy yoki noto‘g‘ri qiymatlar uchun validatsiya
    if (typeof amount !== 'number' || isNaN(amount) || amount < 0) {
      return res
        .status(400)
        .json({ message: 'Amount 0 dan kichik bo‘lishi mumkin emas.' });
    }
    if (typeof usageLimit !== 'number' || isNaN(usageLimit) || usageLimit < 0) {
      return res
        .status(400)
        .json({ message: 'Usage limit 0 dan kichik bo‘lishi mumkin emas.' });
    }
    if (
      usedCount !== undefined &&
      (typeof usedCount !== 'number' || isNaN(usedCount) || usedCount < 0)
    ) {
      return res
        .status(400)
        .json({ message: 'Used count 0 dan kichik bo‘lishi mumkin emas.' });
    }

    // 🧹 Muddati o‘tgan kuponlarni avtomatik o‘chirish
    await Coupon.deleteMany({ expiresAt: { $lt: new Date() } });

    // 🔍 Kupon code tekshiruvi
    const existing = await Coupon.findOne({ code });
    if (existing) {
      return res
        .status(400)
        .json({ message: 'Coupon code allaqachon mavjud.' });
    }

    // 🕒 Amal qilish muddati
    const now = new Date();
    const expiresAt = new Date(
      now.getTime() + (validDays || 7) * 24 * 60 * 60 * 1000
    );

    const coupon = await Coupon.create({
      code,
      type,
      amount,
      usageLimit,
      usedCount: usedCount || 0,
      image,
      expiresAt,
    });

    res.status(201).json(coupon);
  } catch (err) {
    res.status(500).json({ message: 'Server xatosi', error: err.message });
  }
};
  

exports.applyCoupon = async (req, res) => {
  try {
    const { code, cartItems } = req.body;

    // 🛡 1. Tekshiruvlar
    if (!code || !Array.isArray(cartItems)) {
      return res.status(400).json({ message: 'code va cartItems majburiy' });
    }

    // 🔍 2. Kuponni topamiz
    const coupon = await Coupon.findOne({ code });
    if (!coupon) {
      return res.status(400).json({ message: 'Coupon topilmadi.' });
    }
    console.log('🎯 Kupon:', coupon);

    // ⌛ 3. Amal qilish muddati tekshiruvi
    const now = Date.now();
    const expiry = new Date(coupon.expiresAt).getTime();
    if (now > expiry) {
      return res.status(400).json({ message: 'Kupon muddati o‘tgan.' });
    }

    // 🔁 4. Kupon ishlatish limiti
    if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
      return res
        .status(400)
        .json({ message: 'Kupon ishlatish limiti tugagan.' });
    }

    // 💰 5. Jami narxni hisoblash
    let orderTotal = 0;

    for (const item of cartItems) {
      const product = await Product.findById(item.productId);

      if (!product) {
        return res
          .status(404)
          .json({ message: `Mahsulot topilmadi: ${item.productId}` });
      }

      const price = product.price?.sellingPrice || 0;
      const quantity = item.quantity || 1;

      orderTotal += price * quantity;
    }
    console.log('🧾 Jami narx:', orderTotal);
    // 🧮 6. Chegirma hisoblash
    let discountAmount = 0;
    if (coupon.type === 'percent') {
      discountAmount = (orderTotal * coupon.amount) / 100;
    } else if (coupon.type === 'fixed') {
      discountAmount = coupon.amount;
    }

    const finalAmount = Math.max(orderTotal - discountAmount, 0);

    // 📈 7. Foydalanish sonini oshirish
    coupon.usedCount = (coupon.usedCount || 0) + 1;
    await coupon.save();

    // ✅ 8. Javob
    res.status(200).json({
      message: 'Kupon muvaffaqiyatli qo‘llandi.',
      orderTotal,
      discountType: coupon.type,
      discountAmount,
      finalAmount,
    });
  } catch (err) {
    console.error('❌ applyCoupon error:', err);
    res.status(500).json({ message: 'Server xatosi', error: err.message });
  }
};

exports.getAllCoupons = async (req, res) => {
  try {
    const now = new Date();

    // Faqat amal qilayotgan kuponlar
    const coupons = await Coupon.find({
      expiresAt: { $gt: now },
    }).sort({ createdAt: -1 });

    // (ixtiyoriy) limitga yetmaganlarni olish
    const filtered = coupons.filter((c) => c.usedCount < c.usageLimit);

    res.status(200).json(filtered);
  } catch (err) {
    return res
      .status(500)
      .json({ message: 'Server xatosi', error: err.message });
  }
};

exports.deleteCoupon = async (req, res) => {
  try {
    const deleted = await Coupon.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: 'Coupon not defined.' });
    }
    res.status(200).json({ message: 'Coupon deleted successfully' });
  } catch (err) {
    return res.status(500).json({ message: 'Server xatosi', error: err });
  }
};

exports.updateCoupon = async (req, res) => {
  try {
    const { code, type, amount, usageLimit, image, validDays, usedCount } =
      req.body;

    const updateData = {};

    if (code) updateData.code = code;
    if (type) updateData.type = type;

    // ❗️ Validatsiyalar
    if (amount !== undefined) {
      if (typeof amount !== 'number' || isNaN(amount) || amount < 0) {
        return res
          .status(400)
          .json({ message: 'Amount 0 dan kichik bo‘lishi mumkin emas.' });
      }
      updateData.amount = amount;
    }

    if (usageLimit !== undefined) {
      if (
        typeof usageLimit !== 'number' ||
        isNaN(usageLimit) ||
        usageLimit < 0
      ) {
        return res
          .status(400)
          .json({ message: 'Usage limit 0 dan kichik bo‘lishi mumkin emas.' });
      }
      updateData.usageLimit = usageLimit;
    }

    if (usedCount !== undefined) {
      if (typeof usedCount !== 'number' || isNaN(usedCount) || usedCount < 0) {
        return res
          .status(400)
          .json({ message: 'Used count 0 dan kichik bo‘lishi mumkin emas.' });
      }
      updateData.usedCount = usedCount;
    }

    if (image) updateData.image = image;

    if (validDays !== undefined) {
      const now = new Date();
      updateData.expiresAt = new Date(
        now.getTime() + validDays * 24 * 60 * 60 * 1000
      );
    }

    const updated = await Coupon.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updated) {
      return res.status(404).json({ message: 'Coupon topilmadi.' });
    }

    res.status(200).json({
      message: 'Coupon muvaffaqiyatli yangilandi.',
      coupon: updated,
    });
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res
        .status(400)
        .json({ message: 'Validation xatosi', errors: err.errors });
    }
    return res
      .status(500)
      .json({ message: 'Update xatosi', error: err.message });
  }
};
  
  