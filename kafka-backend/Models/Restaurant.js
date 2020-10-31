const mongoose = require('mongoose');

const { Schema } = mongoose;

const restaurantSchema = new Schema(
  {
    RestaurantID: { type: String, required: true },
    Name: { type: String, required: true },
    Email: { type: String, required: true },
    CountryName: { type: String, required: true },
    StateName: { type: String, required: true },
    City: { type: String, required: true },
    Zip: { type: Number, min: 10000, max: 99999, required: true },
    Street: { type: String, required: true },
    PhoneNo: { type: Number, min: 1000000000, max: 9999999999, required: true },
    CountryCode: { type: Number, min: 1, max: 9, required: true },
    OpeningTime: { type: String },
    ClosingTime: { type: String },
    ImageURL: { type: String },
    CurbsidePickup: { type: Boolean, default: false },
    DineIn: { type: Boolean, default: false },
    YelpDelivery: { type: Boolean, default: false },
    Latitude: { type: String },
    Longitude: { type: String },
    // update while inserting new review
    ReviewCounts: { type: Number, default: 0 },
    TotalRating: { type: Number, default: 0 },
  },
  { versionKey: false }
);

// restaurantSchema.index({ Email: 1, Role: 1 }, { unique: true });

const RestaurantModel = mongoose.model('Restaurant', restaurantSchema);
module.exports = RestaurantModel;
