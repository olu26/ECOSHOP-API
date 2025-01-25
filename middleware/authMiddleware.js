const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel.js');

// @desc    Protect routes with JWT authentication
// @access  Private
const protect = asyncHandler(async (req, res, next) => {
  let token;

  // Check for token in the Authorization header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Extract token from header
      token = req.headers.authorization.split(' ')[1];

      // Debugging: Log the token
      console.log('Token:', token);

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Debugging: Log the decoded token payload
      console.log('Decoded Token:', decoded);

      // Attach user to the request object
      req.user = await User.findById(decoded.id).select('-password');

      // Debugging: Log the authenticated user
      console.log('Authenticated User:', req.user);

      next();
    } catch (error) {
      console.error('Token Verification Error:', error);
      res.status(401);
      throw new Error('Not authorized, token failed');
    }
  }

  // If no token is found
  if (!token) {
    console.error('No token provided');
    res.status(401);
    throw new Error('Not authorized, no token');
  }
});

// @desc    Restrict access to admin users
// @access  Private/Admin
const admin = asyncHandler(async (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    console.error('User is not an admin');
    res.status(401);
    throw new Error('Not authorized as admin');
  }
});

module.exports = { protect, admin };