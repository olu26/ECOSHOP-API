const asyncHandler = require('express-async-handler');
const Product = require('../models/productModel');

// description    Add sample products
// route   POST /api/sample-products
// access  Private/Admin
const addSampleProducts = asyncHandler(async (req, res) => {
  const existingProducts = await Product.countDocuments();

  if (existingProducts > 0) {
    return res.status(400).json({ message: 'Sample products already exist.' });
  }

  const sampleProducts = [
    {
      name: 'Television',
      price: 30000,
      user: req.user._id,
      image: '/images/sample.jpg',
      brand: 'Samsung',
      category: 'appliance',
      countInStock: 10,
      numReviews: 0,
      description: 'A very valuable asset for your home.',
    },
    {
      name: 'Refrigerator',
      price: 50000,
      user: req.user._id,
      image: '/images/sample.jpg',
      brand: 'LG',
      category: 'appliance',
      countInStock: 5,
      numReviews: 0,
      description: 'Keep your food fresh and cool.',
    },
    {
      name: 'Washing Machine',
      price: 20000,
      user: req.user._id,
      image: '/images/sample.jpg',
      brand: 'Whirlpool',
      category: 'appliance',
      countInStock: 8,
      numReviews: 0,
      description: 'Make laundry day easier.',
    },
  ];

  await Product.insertMany(sampleProducts);
  res.status(201).json({ message: 'Sample products added successfully.' });
});

module.exports = {
  addSampleProducts,
};
