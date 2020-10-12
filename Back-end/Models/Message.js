const mongoose = require('mongoose');

const { Schema } = mongoose;

const messageSchema = new Schema(
  {
    MessageString: { type: String, required: true },
    CustomerId: { type: Number, required: true },
    CustomerName: { type: String, required: true },
    RestaurantId: { type: Number, required: true },
    RestaurantName: { type: String, required: true },
    MessageTime: { type: Date, required: true },
  },
  { versionKey: false }
);

const MessageModel = mongoose.model('message', messageSchema);
module.exports = MessageModel;
