const mongoose = require('mongoose');

const { Schema } = mongoose;

const countrySchema = new Schema(
  {
    Name: { type: String, required: true },
    CountryCode: { type: Number, required: true, min: 1, max: 9 },
  },
  { versionKey: false }
);

const CountryModel = mongoose.model('country', countrySchema);
module.exports = CountryModel;
