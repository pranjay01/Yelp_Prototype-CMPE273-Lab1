const mongoose = require('mongoose');

const { Schema } = mongoose;

const customerSchema = new Schema(
  {
    CustomerID: { type: String, required: true },
    FirstName: { type: String, required: true },
    LastName: { type: String, required: true },
    Gender: { type: String, required: true },
    NickName: { type: String },
    DOB: { type: Date },
    Email: { type: String, required: true },
    CountryName: { type: String },
    StateName: { type: String },
    City: { type: String },
    Zip: { type: Number, min: 10000, max: 99999 },
    Street: { type: String },
    PhoneNo: { type: Number, min: 1000000000, max: 9999999999 },
    CountryCode: { type: Number, min: 1, max: 9 },
    Headline: { type: String },
    ILove: { type: String },
    ImageURL: { type: String, default: '' },
    FindMeIn: { type: String },
    Website: { type: String },
    JoinDate: { type: Date },
    RegisteredEvents: [String],
    ReviewCount: { type: Number },
  },
  { versionKey: false }
);

// restaurantSchema.index({ Email: 1, Role: 1 }, { unique: true });

const CustomerModel = mongoose.model('customer', customerSchema);
module.exports = CustomerModel;
