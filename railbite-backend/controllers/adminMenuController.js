const MenuItem = require('../models/MenuItem');

exports.getMenuAdmin = async (req, res, next) => {
  try {
    const items = await MenuItem.find().sort({ createdAt: -1 });
    res.json({ success: true, data: items });
  } catch (err) {
    next(err);
  }
};

exports.createMenuItem = async (req, res, next) => {
  try {
    const item = await MenuItem.create(req.body);
    res.status(201).json({ success: true, data: item });
  } catch (err) {
    next(err);
  }
};

exports.updateMenuItem = async (req, res, next) => {
  try {
    const item = await MenuItem.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!item) {
      return res
        .status(404)
        .json({ success: false, message: 'Menu item not found' });
    }
    res.json({ success: true, data: item });
  } catch (err) {
    next(err);
  }
};

exports.deleteMenuItem = async (req, res, next) => {
  try {
    const item = await MenuItem.findById(req.params.id);
    if (!item) {
      return res
        .status(404)
        .json({ success: false, message: 'Menu item not found' });
    }
    await item.deleteOne();
    res.json({ success: true, message: 'Menu item deleted' });
  } catch (err) {
    next(err);
  }
};
