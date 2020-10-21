const mongoose = require('mongoose');

const { Schema } = mongoose;

const orderSchema = new Schema(
  {
    CustomerID: { type: String, required: true },
    Address: { type: String },
    CustomerName: { type: String, required: true },
    CustomerImageUrl: { type: String, required: true },
    RestaurantID: { type: String, required: true },
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
        'Cancel Order',
      ],
      default: 'Order Received',
    },
    DeliverStatusID: { type: Number, default: 1 },
    Bill: { type: Number, required: true },
    OrderCart: [
      {
        FoodName: { type: String },
        MenuCategory: { type: String },
        Quantity: { type: Number },
        Price: { type: Number },
      },
    ],
  },
  { versionKey: false }
);

const OrderModel = mongoose.model('order', orderSchema);
module.exports = OrderModel;
