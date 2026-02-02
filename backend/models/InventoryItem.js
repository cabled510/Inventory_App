const mongoose = require('mongoose');

const inventoryItemSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a product name'],
      trim: true,
      maxlength: [100, 'Product name cannot exceed 100 characters'],
    },
    description: {
      type: String,
      required: [true, 'Please provide a product description'],
      maxlength: [500, 'Description cannot exceed 500 characters'],
    },
    category: {
      type: String,
      required: [true, 'Please provide a category'],
      enum: [
        'Electronics',
        'Clothing',
        'Food',
        'Furniture',
        'Toys',
        'Books',
        'Sports',
        'Other',
      ],
    },
    quantity: {
      type: Number,
      required: [true, 'Please provide quantity'],
      min: [0, 'Quantity cannot be negative'],
      default: 0,
    },
    price: {
      type: Number,
      required: [true, 'Please provide a price'],
      min: [0, 'Price cannot be negative'],
    },
    sku: {
      type: String,
      required: [true, 'Please provide a SKU'],
      unique: true,
      trim: true,
      uppercase: true,
    },
    supplier: {
      type: String,
      trim: true,
      maxlength: [100, 'Supplier name cannot exceed 100 characters'],
    },
    status: {
      type: String,
      enum: ['In Stock', 'Low Stock', 'Out of Stock'],
      default: function () {
        if (this.quantity === 0) return 'Out of Stock';
        if (this.quantity < 10) return 'Low Stock';
        return 'In Stock';
      },
    },
    image: {
      type: String,
      default: null,
    },
    imageUrl: {
      type: String,
      default: null,
      trim: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    lastUpdated: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Update status based on quantity
inventoryItemSchema.pre('save', function (next) {
  if (this.quantity === 0) {
    this.status = 'Out of Stock';
  } else if (this.quantity < 10) {
    this.status = 'Low Stock';
  } else {
    this.status = 'In Stock';
  }
  this.lastUpdated = Date.now();
  next();
});

// Index for faster queries
inventoryItemSchema.index({ name: 'text', description: 'text' });

module.exports = mongoose.model('InventoryItem', inventoryItemSchema);
