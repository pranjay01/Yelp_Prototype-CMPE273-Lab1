const mongoose = require('mongoose');

const { Schema } = mongoose;

const orderSchema = new Schema(
  {
    CustomerId: { type: Number, required: true },
    CustomerName: { type: String, required: true },
    CustomerImageUrl: { type: String, required: true },
    RestaurantId: { type: Number, required: true },
    RestaurantName: { type: String, required: true },
    OrderedDate: { type: Date, required: true },
    OrderType: { type: String, enum: ['Delivery', 'Pick_up'], required: true },
    DeliveryStatus: {
      type: String,
      enum: [
        'Order Received',
        'Preparing',
        'On the way',
        'Pick up Ready',
        'Delivered',
        'Picked up',
        'Canceled',
      ],
      required: true,
    },
    Bill: { type: Number, required: true },
    OrderCart: [
      { FoodName: { type: String }, MenuCategory: { type: String }, Quantity: { type: String } },
    ],
  },
  { versionKey: false }
);

const OrderModel = mongoose.model('order', orderSchema);
module.exports = OrderModel;
