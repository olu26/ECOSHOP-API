const mongoose = require('mongoose');

const reviewSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 }, 
    comment: { type: String, required: true },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

const productSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    name: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    brand: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    reviews: [reviewSchema],
    rating: {
      type: Number,
      required: true,
      default: 0,
    },
    numReviews: {
      type: Number,
      required: true,
      default: 0,
    },
    price: {
      type: Number,
      required: true,
      default: 0,
      get: (price) => (price / 100).toFixed(2), 
      set: (price) => Math.round(price * 100), g
    },
    countInStock: {
      type: Number,
      required: true,
      default: 0,
      min: 0, 
    },
  },
  {
    timestamps: true,
    toJSON: { getters: true }, 
  }
);


productSchema.index({ category: 1 });
productSchema.index({ brand: 1 });
productSchema.index({ rating: -1 });

// Method to update product rating and number of reviews
productSchema.methods.updateRating = async function () {
  const product = this;
  const reviews = product.reviews;

  if (reviews.length === 0) {
    product.rating = 0;
    product.numReviews = 0;
  } else {
    const totalRating = reviews.reduce((acc, review) => acc + review.rating, 0);
    product.rating = totalRating / reviews.length;
    product.numReviews = reviews.length;
  }

  await product.save();
};

const Product = mongoose.model('Product', productSchema);
module.exports = Product;