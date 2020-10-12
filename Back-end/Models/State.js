const mongoose = require('mongoose');

const { Schema } = mongoose;

const stateSchema = new Schema(
  {
    Name: { type: String, required: true },
  },
  { versionKey: false }
);

const StateModel = mongoose.model('state', stateSchema);
module.exports = StateModel;
