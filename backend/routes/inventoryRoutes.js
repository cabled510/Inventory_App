const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const {
  getInventoryItems,
  getInventoryItem,
  createInventoryItem,
  updateInventoryItem,
  deleteInventoryItem,
  getInventoryStats,
} = require('../controllers/inventoryController');
const { protect } = require('../middleware/auth');
const validate = require('../middleware/validate');
const upload = require('../middleware/upload');

// Validation rules
const inventoryValidation = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Product name is required')
    .isLength({ max: 100 })
    .withMessage('Product name cannot exceed 100 characters'),
  body('description')
    .trim()
    .notEmpty()
    .withMessage('Description is required')
    .isLength({ max: 500 })
    .withMessage('Description cannot exceed 500 characters'),
  body('category')
    .notEmpty()
    .withMessage('Category is required')
    .isIn([
      'Electronics',
      'Clothing',
      'Food',
      'Furniture',
      'Toys',
      'Books',
      'Sports',
      'Other',
    ])
    .withMessage('Invalid category'),
  body('quantity')
    .isInt({ min: 0 })
    .withMessage('Quantity must be a non-negative number'),
  body('price')
    .isFloat({ min: 0 })
    .withMessage('Price must be a non-negative number'),
  body('sku')
    .trim()
    .notEmpty()
    .withMessage('SKU is required')
    .toUpperCase(),
];

// Routes
router.get('/stats', protect, getInventoryStats);
router.get('/', protect, getInventoryItems);
router.get('/:id', protect, getInventoryItem);
router.post('/', protect, upload.single('image'), inventoryValidation, validate, createInventoryItem);
router.put('/:id', protect, upload.single('image'), updateInventoryItem);
router.delete('/:id', protect, deleteInventoryItem);

module.exports = router;
