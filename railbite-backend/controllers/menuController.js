const MenuItem = require('../models/MenuItem');

// @desc    Get all menu items with filtering, searching, and sorting
// @route   GET /api/menu?category=breakfast&search=paratha&sortBy=price-low&priceRange=100-200
// @access  Public
exports.getMenuItems = async (req, res) => {
  try {
    const { category, search, sortBy, priceRange } = req.query;

    let query = { available: true };

    // Filter by category
    if (category) {
      query.category = category;
    }

    // Search filter
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    // Price range filter
    if (priceRange) {
      if (priceRange === '0-100') {
        query.price = { $lt: 100 };
      } else if (priceRange === '100-200') {
        query.price = { $gte: 100, $lt: 200 };
      } else if (priceRange === '200-300') {
        query.price = { $gte: 200, $lt: 300 };
      } else if (priceRange === '300+') {
        query.price = { $gte: 300 };
      }
    }

    // Sorting
    let sortOptions = {};
    if (sortBy === 'name-asc') {
      sortOptions.name = 1;
    } else if (sortBy === 'name-desc') {
      sortOptions.name = -1;
    } else if (sortBy === 'price-low') {
      sortOptions.price = 1;
    } else if (sortBy === 'price-high') {
      sortOptions.price = -1;
    } else {
      sortOptions.createdAt = -1; // default
    }

    const menuItems = await MenuItem.find(query).sort(sortOptions);

    res.json({
      success: true,
      count: menuItems.length,
      data: menuItems
    });
  } catch (error) {
    res.status(500).json({
    success: false,
    message: error.message
  });
  }
};

// @desc    Get single menu item
// @route   GET /api/menu/:id
// @access  Public
exports.getMenuItem = async (req, res, next) => {
  try {
    const menuItem = await MenuItem.findById(req.params.id);

    if (!menuItem) {
      return res.status(404).json({
        success: false,
        message: 'Menu item not found'
      });
    }

    res.json({
      success: true,
      data: menuItem
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create menu item (Admin only)
// @route   POST /api/menu
// @access  Private/Admin
exports.createMenuItem = async (req, res, next) => {
  try {
    const menuItem = await MenuItem.create(req.body);

    res.status(201).json({
      success: true,
      data: menuItem
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update menu item (Admin only)
// @route   PUT /api/menu/:id
// @access  Private/Admin
exports.updateMenuItem = async (req, res, next) => {
  try {
    const menuItem = await MenuItem.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!menuItem) {
      return res.status(404).json({
        success: false,
        message: 'Menu item not found'
      });
    }

    res.json({
      success: true,
      data: menuItem
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete menu item (Admin only)
// @route   DELETE /api/menu/:id
// @access  Private/Admin
exports.deleteMenuItem = async (req, res, next) => {
  try {
    const menuItem = await MenuItem.findByIdAndDelete(req.params.id);

    if (!menuItem) {
      return res.status(404).json({
        success: false,
        message: 'Menu item not found'
      });
    }

    res.json({
      success: true,
      message: 'Menu item deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get menu categories
// @route   GET /api/menu/categories/list
// @access  Public
exports.getCategories = async (req, res, next) => {
  try {
    const categories = await MenuItem.distinct('category');

    res.json({
      success: true,
      data: categories
    });
  } catch (error) {
    next(error);
  }
};
