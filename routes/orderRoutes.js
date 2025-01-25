const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const asyncHandler = require('express-async-handler');
const {
  createOrder,
  getOrderById,
  updateOrderToPaid,
  getMyOrders,
} = require('../controllers/orderController');
const { protect, admin } = require('../middleware/authMiddleware');

// Validation middleware for creating an order
const validateOrder = [
  body('orderItems').isArray({ min: 1 }).withMessage('At least one order item is required'),
  body('shippingAddress').notEmpty().withMessage('Shipping address is required'),
  body('paymentMethod').notEmpty().withMessage('Payment method is required'),
  body('itemsPrice').isNumeric().withMessage('Items price must be a number'),
  body('taxPrice').isNumeric().withMessage('Tax price must be a number'),
  body('shippingPrice').isNumeric().withMessage('Shipping price must be a number'),
  body('totalPrice').isNumeric().withMessage('Total price must be a number'),
];

// @desc    Create a new order
// @route   POST /api/orders
// @access  Private
router.route('/').post(protect, validateOrder, asyncHandler(createOrder));

// @desc    Get logged-in user's orders
// @route   GET /api/orders/myorders
// @access  Private
router.route('/myorders').get(protect, asyncHandler(getMyOrders));

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
router.route('/:id').get(protect, asyncHandler(getOrderById));

// @desc    Update order to paid
// @route   PUT /api/orders/:id/pay
// @access  Private
router.route('/:id/pay').put(protect, asyncHandler(updateOrderToPaid));

module.exports = router;