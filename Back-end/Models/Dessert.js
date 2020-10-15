const mongoose = require('mongoose');

const { Schema } = mongoose;

const dessertSchema = new Schema(
  {
    RestaurantID: { type: String, required: true },
    FoodName: { type: String, required: true },
    MainIngredients: { type: String, required: true },
    Cuisine: { type: String, required: true },
    Description: { type: String },
    ImageUrl: { type: String },
    Price: { type: Number, required: true },
  },
  { versionKey: false }
);

// userSignupSchema.index({ Email: 1, Role: 1 }, { unique: true });

const DessertModel = mongoose.model('dessert', dessertSchema);
module.exports = DessertModel;
