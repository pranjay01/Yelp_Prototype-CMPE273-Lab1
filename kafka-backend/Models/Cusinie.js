const mongoose = require('mongoose');

const { Schema } = mongoose;

const cuisineSchema = new Schema(
  {
    CuisineName: { type: String, required: true },
  },
  { versionKey: false }
);

const CuisineModel = mongoose.model('cuisine', cuisineSchema);
module.exports = CuisineModel;
