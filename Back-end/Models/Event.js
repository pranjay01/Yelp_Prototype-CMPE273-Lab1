const mongoose = require('mongoose');

const { Schema } = mongoose;

const eventSchema = new Schema(
  {
    RestaurantId: { type: String },
    Name: { type: String, required: true },
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
    RegisteredCustomers: [{ ID: { type: Number }, Name: { type: String } }],
  },
  { versionKey: false }
);

const EventModel = mongoose.model('event', eventSchema);
module.exports = EventModel;
