const mongoose = require('mongoose');

const { Schema } = mongoose;

const foodItemSchema = new Schema(
  {
    RestaurantID: { type: String, required: true },
    FoodName: { type: String, required: true },
    MenuCategoryName: {
      type: String,
      enum: ['APPETIZERS', 'SALADS', 'DESSERTS', 'BEVERAGES', 'MAIN_COURSE'],
      required: true,
    },
    MainIngredients: { type: String, required: true },
    Cuisine: { type: String, required: true },
    Description: { type: String },
    ImageUrl: { type: String },
    Price: { type: Number, required: true },
  },
  { versionKey: false }
);

// userSignupSchema.index({ Email: 1, Role: 1 }, { unique: true });

const FoodItemModel = mongoose.model('foodItem', foodItemSchema);
module.exports = FoodItemModel;
