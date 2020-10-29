const mongoose = require('mongoose');

const { Schema } = mongoose;

const genderSchema = new Schema(
  {
    GenderType: { type: String, required: true },
  },
  { versionKey: false }
);

const GenderModel = mongoose.model('gender', genderSchema);
module.exports = GenderModel;
