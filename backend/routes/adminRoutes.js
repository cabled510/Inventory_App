const express = require('express');
const router = express.Router();
const {
  getAllUsers,
  getUser,
  updateUserRole,
  deleteUser,
  getAdminStats,
} = require('../controllers/adminController');
const { protect, admin } = require('../middleware/auth');

// All routes require authentication and admin role
router.use(protect);
router.use(admin);

// Stats route
router.get('/stats', getAdminStats);

// User management routes
router.get('/users', getAllUsers);
router.get('/users/:id', getUser);
router.put('/users/:id/role', updateUserRole);
router.delete('/users/:id', deleteUser);

module.exports = router;
