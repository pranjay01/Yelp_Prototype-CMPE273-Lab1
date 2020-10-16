const mongoose = require('mongoose');

const { Schema } = mongoose;

const eventSchema = new Schema(
  {
    RestaurantID: { type: String },
    EventName: { type: String, required: true },
    Description: { type: String, required: true },
    EventDate: { type: Date, required: true },
    StartTime: { type: String, required: true },
    EndTime: { type: String, required: true },
    CountryName: { type: String, required: true },
    StateName: { type: String, required: true },
    City: { type: String, required: true },
    Street: { type: String, required: true },
    HashTags: { type: String, required: true },
    Zip: { type: Number, min: 10000, max: 99999, required: true },
    // concat customer name while insertion
    RegisteredCustomers: [
      { CustomerID: { type: String }, CustomerName: { type: String }, Email: { type: String } },
    ],
  },
  { versionKey: false }
);

const EventModel = mongoose.model('event', eventSchema);
module.exports = EventModel;
