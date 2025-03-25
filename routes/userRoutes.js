const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const asyncHandler = require('express-async-handler');
const { protect, admin } = require('../middleware/authMiddleware'); // ✅ Keep this one

const { 
  authUser, 
  registerUser, 
  getUserProfile, 
  updateUserProfile, 
  getAllUsers, 
  deleteUser, 
  updateUserRole, 
  forgotPassword, 
  verifyOtp 
} = require('../controllers/userController');

router.route('/:id').delete(protect, admin, asyncHandler(deleteUser));
router.route('/:id/role').put(protect, admin, asyncHandler(updateUserRole));
router.route('/forgot-password').post(asyncHandler(forgotPassword));
router.route('/verify-otp').post(asyncHandler(verifyOtp));

// ❌ Remove this duplicate import:
// const { protect, admin } = require('../middleware/authMiddleware');

// Validation middleware for registering/updating a user
const validateUser = [
  body('name').notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Invalid email'),
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters long'),
];

const validateLogin = [
  body('email').isEmail().withMessage('Invalid email'),
  body('password').notEmpty().withMessage('Password is required'),
];

router.post('/login', validateLogin, asyncHandler(authUser));
router.post('/user', registerUser);
router.route('/profile').get(protect, asyncHandler(getUserProfile));
router.route('/profile').put(protect, validateUser, asyncHandler(updateUserProfile));

module.exports = router;
