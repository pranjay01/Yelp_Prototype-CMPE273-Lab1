const mongoose = require('mongoose');

const { Schema } = mongoose;

const messageSchema = new Schema(
  {
    MessageArray: [
      {
        MessageInstance: { type: String, required: true },
        SentFrom: { type: String, required: true },
        SentTime: { type: Date, required: true },
      },
    ],
    CustomerId: { type: String, required: true },
    CustomerName: { type: String, required: true },
    RestaurantId: { type: String, required: true },
    RestaurantName: { type: String, required: true },
  },
  { versionKey: false }
);

const MessageModel = mongoose.model('message', messageSchema);
module.exports = MessageModel;
