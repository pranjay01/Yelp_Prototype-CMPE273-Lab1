const mongoose = require('mongoose');

const { Schema } = mongoose;

const reviewSchema = new Schema(
  {
    RestaurantID: { type: String, required: true },
    Rating: { type: Number, min: 1, max: 5 },
    CustomerID: { type: String, required: true },
    // concat First and last name while insertion
    CustomerName: { type: String, required: true },
    // concat City and Zip  while insertion
    CustomerAddr: { type: String },
    Description: { type: String, required: true },
    ImageUrl: { type: String },
    ReviewDate: { type: String },
  },
  { versionKey: false }
);

// userSignupSchema.index({ Email: 1, Role: 1 }, { unique: true });

const ReviewModel = mongoose.model('review', reviewSchema);
module.exports = ReviewModel;
