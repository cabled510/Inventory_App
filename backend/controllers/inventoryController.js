const InventoryItem = require('../models/InventoryItem');
const fs = require('fs');
const path = require('path');

// @desc    Get all inventory items
// @route   GET /api/inventory
// @access  Private
const getInventoryItems = async (req, res) => {
  try {
    const { search, category, status } = req.query;
    let query = {};

    // Search filter
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { sku: { $regex: search, $options: 'i' } },
      ];
    }

    // Category filter
    if (category) {
      query.category = category;
    }

    // Status filter
    if (status) {
      query.status = status;
    }

    const items = await InventoryItem.find(query)
      .populate('createdBy', 'username email')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: items.length,
      data: items,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get single inventory item
// @route   GET /api/inventory/:id
// @access  Private
const getInventoryItem = async (req, res) => {
  try {
    const item = await InventoryItem.findById(req.params.id).populate(
      'createdBy',
      'username email'
    );

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Inventory item not found',
      });
    }

    res.json({
      success: true,
      data: item,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Create new inventory item
// @route   POST /api/inventory
// @access  Private
const createInventoryItem = async (req, res) => {
  try {
    const { name, description, category, quantity, price, sku, supplier, imageUrl } =
      req.body;

    // Handle image upload or URL
    let image = null;
    if (req.file) {
      image = `/uploads/products/${req.file.filename}`;
    }

    const item = await InventoryItem.create({
      name,
      description,
      category,
      quantity,
      price,
      sku,
      supplier,
      image,
      imageUrl: imageUrl || null,
      createdBy: req.user._id,
    });

    res.status(201).json({
      success: true,
      data: item,
    });
  } catch (error) {
    // Delete uploaded file if there's an error
    if (req.file) {
      fs.unlink(req.file.path, (err) => {
        if (err) console.error('Error deleting file:', err);
      });
    }
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Update inventory item
// @route   PUT /api/inventory/:id
// @access  Private
const updateInventoryItem = async (req, res) => {
  try {
    let item = await InventoryItem.findById(req.params.id);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Inventory item not found',
      });
    }

    // Handle image upload
    if (req.file) {
      // Delete old image if it exists
      if (item.image) {
        const oldImagePath = path.join(__dirname, '..', item.image);
        fs.unlink(oldImagePath, (err) => {
          if (err && err.code !== 'ENOENT') {
            console.error('Error deleting old image:', err);
          }
        });
      }
      req.body.image = `/uploads/products/${req.file.filename}`;
    }

    item = await InventoryItem.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.json({
      success: true,
      data: item,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Delete inventory item
// @route   DELETE /api/inventory/:id
// @access  Private
const deleteInventoryItem = async (req, res) => {
  try {
    const item = await InventoryItem.findById(req.params.id);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Inventory item not found',
      });
    }

    // Delete associated image if it exists
    if (item.image) {
      const imagePath = path.join(__dirname, '..', item.image);
      fs.unlink(imagePath, (err) => {
        if (err && err.code !== 'ENOENT') {
          console.error('Error deleting image:', err);
        }
      });
    }

    await item.deleteOne();

    res.json({
      success: true,
      message: 'Inventory item removed',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get inventory statistics
// @route   GET /api/inventory/stats
// @access  Private
const getInventoryStats = async (req, res) => {
  try {
    const totalItems = await InventoryItem.countDocuments();
    const lowStockItems = await InventoryItem.countDocuments({
      status: 'Low Stock',
    });
    const outOfStockItems = await InventoryItem.countDocuments({
      status: 'Out of Stock',
    });

    const totalValue = await InventoryItem.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: { $multiply: ['$quantity', '$price'] } },
        },
      },
    ]);

    const categoryBreakdown = await InventoryItem.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
          totalQuantity: { $sum: '$quantity' },
        },
      },
    ]);

    res.json({
      success: true,
      data: {
        totalItems,
        lowStockItems,
        outOfStockItems,
        totalValue: totalValue[0]?.total || 0,
        categoryBreakdown,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getInventoryItems,
  getInventoryItem,
  createInventoryItem,
  updateInventoryItem,
  deleteInventoryItem,
  getInventoryStats,
};
