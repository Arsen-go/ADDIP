const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  id: {
    type: String,
    unique: true,
    required: true,
  },
  phone: {
    type: String,
    unique: true,
    required: true,
  },
  email: {
    type: String,
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  birthDate: {
    type: Date,
    required: true,
  },
  country: {
    type: String
  },
  city: {
    type: String,
  },
  createdDate: {
    type: Date,
    default: Date.now(),
  },
  role: {
    type: String,
    required: true,
    default: "USER",
  },
  userCar: { type: Schema.Types.ObjectId, ref: "UserCar" },
  stripe: { type: Schema.Types.ObjectId, ref: "Stripe" },
});

const User = mongoose.model("User", userSchema);
module.exports = { User };
