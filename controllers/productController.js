const asyncHandler = require('express-async-handler');
const Product = require('../models/productModel');

// description    Fetch all products
// route   GET /api/products
// access  Public
const getProducts = asyncHandler(async (req, res) => {
  const pageSize = 12;
  const page = Number(req.query.pageNumber) || 1;
  const keyword = req.query.keyword
    ? {
        name: {
          $regex: req.query.keyword,
          $options: 'i',
        },
      }
    : {};

  const count = await Product.countDocuments({ ...keyword });
  const products = await Product.find({ ...keyword })
    .limit(pageSize)
    .skip(pageSize * (page - 1));

  res.json({
    message: "Successful",
    allproduct: products.map(product => ({
      _id: product._id,
      productname: product.name,
      price: product.price,
      category: product.category,
      stock: product.countInStock,
      description: product.description,
      images: product.images,
      displayimage: product.image,
      addedBy: product.user,
      createdAt: product.createdAt,
      __v: product.__v
    }))
  });

});

// description    Fetch single product
// route   GET /api/products/:id
// access  Public
const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (product) {
    res.json(product);
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

// description    Create a product
// route   POST /api/products
// access  Private/Admin
const createProduct = asyncHandler(async (req, res) => {
  const product = new Product({
    name: 'alien ware x17',
    price: 20000000, 
    user: req.user._id,
    image: 'https://th.bing.com/th/id/OIP.K_QTUsw4A3ThwZGxA_l-rQHaDt?w=334&h=175&c=7&r=0&o=5&pid=1.7.jpg',
    brand: 'dell',
    category: 'laptop',
    countInStock: 2,
    numReviews: 34,
    description: 'a very good laptop',
    reviews: [
      {
        name: 'admin',
        rating: 4,
        comment: 'good product',
      },
    ],
  });

  const createdProduct = await product.save();
  res.status(201).json(createdProduct);
});

// description    Update a product
// route   PUT /api/products/:id
// access  Private/Admin
const updateProduct = asyncHandler(async (req, res) => {
  const { name, price, description, image, brand, category, countInStock } =
    req.body;

  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  product.name = name;
  product.price = price;
  product.description = description;
  product.image = image;
  product.brand = brand;
  product.category = category;
  product.countInStock = countInStock;

  const updatedProduct = await product.save();
  res.json(updatedProduct);
});

// descripton    Delete a product
// route   DELETE /api/products/:id
// access  Private/Admin
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  await product.remove();
  res.json({ message: 'Product removed' });
});

// descripton    Create a product review
// route   POST /api/products/:id/reviews
// access  Private
const createProductReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;

  if (rating < 1 || rating > 5) {
    res.status(400);
    throw new Error('Rating must be between 1 and 5');
  }

  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  const alreadyReviewed = product.reviews.find(
    (r) => r.user.toString() === req.user._id.toString()
  );

  if (alreadyReviewed) {
    res.status(400);
    throw new Error('Product already reviewed');
  }

  const review = {
    name: req.user.name,
    rating: Number(rating),
    comment,
    user: req.user._id,
  };

  product.reviews.push(review);
  product.numReviews = product.reviews.length;
  product.rating =
    product.reviews.reduce((acc, item) => item.rating + acc, 0) /
    product.reviews.length;

  await product.save();
  res.status(201).json({ message: 'Review added' });
});

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  createProductReview,
};
