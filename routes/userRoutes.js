const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const asyncHandler = require('express-async-handler');
const {
  authUser,
  registerUser,
  getUserProfile,
  updateUserProfile,
} = require('../controllers/userController');
const { protect, admin } = require('../middleware/authMiddleware');

// Validation middleware for registering/updating a user
const validateUser = [
  body('name').notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Invalid email'),
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters long'),
];

// Validation middleware for user login
const validateLogin = [
  body('email').isEmail().withMessage('Invalid email'),
  body('password').notEmpty().withMessage('Password is required'),
];

// @desc    Authenticate user & get token
// @route   POST /api/users/login
// @access  Public
router.post('/login', validateLogin, asyncHandler(authUser));

// @desc    Register a new user
// @route   POST /api/user
// @access  Public
router.post('/user', registerUser);

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
router.route('/profile').get(protect, asyncHandler(getUserProfile));

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
router.route('/profile').put(protect, validateUser, asyncHandler(updateUserProfile));

module.exports = router;