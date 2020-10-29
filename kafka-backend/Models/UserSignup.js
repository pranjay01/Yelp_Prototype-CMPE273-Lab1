const mongoose = require('mongoose');

const { Schema } = mongoose;

const userSignupSchema = new Schema(
  {
    Email: { type: String, required: true },
    Password: { type: String, required: true },
    Role: { type: String, enum: ['Customer', 'Restaurant'], required: true },
  },
  { versionKey: false }
);

userSignupSchema.index({ Email: 1, Role: 1 }, { unique: true });

const UserSignupModel = mongoose.model('signup', userSignupSchema);
module.exports = UserSignupModel;
