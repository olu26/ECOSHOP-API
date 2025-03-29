const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const asyncHandler = require('express-async-handler');
const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  createProductReview,
} = require('../controllers/productController');
const { protect, admin } = require('../middleware/authMiddleware');
const { addSampleProducts } = require('../controllers/sampleProductController');


// Validation middleware for creating/updating a product
const validateProduct = [
  body('name').notEmpty().withMessage('Name is required'),
  body('price').isNumeric().withMessage('Price must be a number'),
  body('description').notEmpty().withMessage('Description is required'),
  body('image').notEmpty().withMessage('Image is required'),
  body('brand').notEmpty().withMessage('Brand is required'),
  body('category').notEmpty().withMessage('Category is required'),
  body('countInStock').isNumeric().withMessage('Count in stock must be a number'),
];

// Validation middleware for creating a review
const validateReview = [
  body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
  body('comment').notEmpty().withMessage('Comment is required'),
];

// descripton    Fetch all products
// route   GET /api/products
// access  Public
router.route('/').get(asyncHandler(getProducts));

router.route('/sample-products').post(protect, admin, asyncHandler(addSampleProducts)); 
// description    Create a new product

// route   POST /api/products
// access  Private/Admin
router.route('/').post(protect, admin, validateProduct, asyncHandler(createProduct));

// descripton    Create a new review
// route   POST /api/products/:id/reviews
// access  Private
router.route('/:id/reviews').post(protect, validateReview, asyncHandler(createProductReview));

// descripton    Fetch single product
// route   GET /api/products/:id
// access  Public
router.route('/:id').get(asyncHandler(getProductById));

// descripton    Update a product
// route   PUT /api/products/:id
// access  Private/Admin
router.route('/:id').put(protect, admin, validateProduct, asyncHandler(updateProduct));

// description    Delete a product
// route   DELETE /api/products/:id
// access  Private/Admin
router.route('/:id').delete(protect, admin, asyncHandler(deleteProduct));

module.exports = router;
