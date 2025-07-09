const Shop = require('../models/Shop');
const Product = require('../models/Products')
const User = require('../models/User');
const mongoose = require('mongoose');

// 🔐 UTIL: Check ObjectId validity
const isValidId = (id) => mongoose.Types.ObjectId.isValid(id);

// ✅ CREATE SHOP
exports.createShop = async (req, res) => {
  try {
    const seller = req.user;

    if (seller.role !== 'seller') {
      return res
        .status(403)
        .json({ message: 'Only sellers can create shops.' });
    }

    const {
      shopname,
      description,
      logotype,
      address,
      location,
      TariffPlan,
    } = req.body;

    if (!shopname || !TariffPlan) {
      return res
        .status(400)
        .json({ message: 'shopname and TariffPlan are required.' });
    }

    const banner = req.file ? `/uploads/banner/${req.file.filename}` : undefined;

    // const exists = await Shop.findOne({ owner: seller._id });
    // if (exists) {
    //   return res.status(409).json({ message: 'You already own a shop.' });
    // }
    const bannerPath = req.file ? `/uploads/banner/${req.file.filename}` : '';

    const newShop = await Shop.create({
      shopname,
      description,
      logotype,
      address,
      location,
      banner,
      TariffPlan,
      banner: bannerPath,
      owner: seller._id,
    });

    res.status(201).json({ success: true, shop: newShop });
  } catch (err) {
    console.error('❌ Shop creation error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// ✅ CREATE ShOP BANNER

exports.updateShopBanner = async (req, res) => {
  try {
    const { id } = req.params;
    const { banner } = req.body;

    if (!banner) {
      return res.status(400).json({ message: 'Banner is required' });
    }

    const shop = await Shop.findById(id);
    if (!shop) {
      return res.status(404).json({ message: 'Shop not found' });
    }

    shop.banner = banner;
    await shop.save();
    res.status(201).json({ message: 'Banner updated successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// my shops
exports.getMyShops = async (req, res) => {
  try {
    const sellerId = req.user._id;
    const shops = await Shop.find({ owner: sellerId });
    res.status(200).json(shops);
  } catch (err) {
    console.error('❌ Get My Shops Error:', err.message);
    res.status(500).json({ message: 'Server error while fetching shops' });
  }
};

// ✅ GET ALL SHOPS
exports.getAllShops = async (req, res) => {
  try {
    const shops = await Shop.find()
      .populate('owner', 'username email')
      .populate('products');

    res.status(200).json({ success: true, total: shops.length, data: shops });
  } catch (err) {
    res.status(500).json({ message: 'Could not fetch shops' });
  }
};

// ✅ GET SINGLE SHOP
exports.getShopById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidId(id))
      return res.status(400).json({ message: 'Invalid shop ID' });

    const shop = await Shop.findById(id)
      .populate('owner', 'username')
      .populate('products');

    if (!shop) return res.status(404).json({ message: 'Shop not found' });

    shop.view += 1;
    await shop.save();

    res.status(200).json(shop);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

<<<<<<< HEAD
// ✅ getShopWithProducts
=======
>>>>>>> 3a52405f2412901e59997e700326af7f161ad48b
exports.getShopWithProducts = async (req, res) => {
  try {
    const { id } = req.params;

<<<<<<< HEAD
    if (!isValidId(id))
      return res.status(400).json({ message: 'Invalid shop ID' });

    const shop = await Shop.findById(id).populate('owner', 'username email');
    if (!shop) {
      return res.status(404).json({ message: 'Shop not found' });
    }
    const products = await Product.find({ shop: id }).populate(
      'seller',
      'username'
    );
    res.status(200).json({ shop, products });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

=======
    if (!isValidId(id)) return res.status(404).json({ message: 'Invalid shop ID' });

    const shop = await Shop.findById(id)
      .populate('owner', 'username email')

    if (!shop) {
      return res.status(404).json({ message: 'Shop not found' })
    }

    const products = await Product.find({ shop: id });

    res.status(200).json({ success: true, shop, products})
  } catch (err) {
    res.status(500).json({ message: 'Server error' })
  }
}
>>>>>>> 3a52405f2412901e59997e700326af7f161ad48b
// ✅ EDIT SHOP
exports.editShop = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidId(id))
      return res.status(400).json({ message: 'Invalid shop ID' });

    const shop = await Shop.findById(id);
    if (!shop) return res.status(404).json({ message: 'Shop not found' });

    const isOwner = shop.owner.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';
    if (!isOwner && !isAdmin) {
      return res.status(403).json({ message: 'Permission denied' });
    }

    const updatableFields = [
      'shopname',
      'description',
      'logotype',
      'address',
      'location',
      'TariffPlan',
      'isVerified',
    ];
    updatableFields.forEach((field) => {
      if (req.body[field] !== undefined) shop[field] = req.body[field];
    });

    await shop.save();
    res.json({ message: 'Shop updated', shop });
  } catch (err) {
    res.status(500).json({ message: 'Could not update shop' });
  }
};

// ✅ UPDATE SHOP BANNER
exports.updateShopBanner = async (req, res) => {
  try {
    const { id } = req.params;
    const banner = req.file ? `/uploads/banner/${req.file.filename}` : null;

    if (!isValidId(id)) return res.status(400).json({ message: 'Invalid shop ID' });
    if (!banner) return res.status(400).json({ message: 'Banner URL is required' });

    const shop = await Shop.findById(id);
    if (!shop) return res.status(404).json({ message: 'Shop not found' });

    shop.banner = banner;

    res.json({ message: 'Banner updated successfully', banner: shop.banner })
  } catch (err) {
    res.status(500).json({ message: 'Server error' })
  }
}

// ✅ DELETE SHOP
exports.deleteShop = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidId(id))
      return res.status(400).json({ message: 'Invalid shop ID' });

    const shop = await Shop.findById(id);
    if (!shop) return res.status(404).json({ message: 'Shop not found' });

    const isOwner = shop.owner.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';
    if (!isOwner && !isAdmin) {
      return res.status(403).json({ message: 'Access denied' });
    }

    await shop.deleteOne();
    res.json({ message: 'Shop deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// ✅ BAN SHOP
exports.banShop = async (req, res) => {
  try {
    const { id } = req.params;
    const { from, to, reason } = req.body;

    if (!isValidId(id))
      return res.status(400).json({ message: 'Invalid shop ID' });
    if (!from || !to || !reason) {
      return res
        .status(400)
        .json({ message: 'from, to, and reason are required to ban a shop.' });
    }

    const shop = await Shop.findById(id);
    if (!shop) return res.status(404).json({ message: 'Shop not found' });

    shop.isBanned = {
      status: true,
      from: new Date(from),
      to: new Date(to),
      reason,
    };

    await shop.save();
    res.json({ message: 'Shop banned successfully', banned: shop.isBanned });
  } catch (err) {
    res.status(500).json({ message: 'Could not ban shop' });
  }
};
