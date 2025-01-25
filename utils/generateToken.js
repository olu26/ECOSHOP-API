const jwt = require('jsonwebtoken');

const generateToken = (user) => {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined in the environment variables.');
  }

  return jwt.sign(
    {
      id: user._id,
      isAdmin: user.isAdmin, // Include additional user information if needed
    },
    process.env.JWT_SECRET,
    {
      expiresIn: '30d', // Set token expiration
    }
  );
};

module.exports = generateToken;