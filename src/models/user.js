const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  id: {
    type: String,
    unique: true,
    required: true,
  },
  email: {
    type: String,
    required: true,
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
  password: {
    type: String,
    required: true,
  },
  createdDate: {
    type: Date,
    default: Date.now(),
  },
  faculty: {
    type: String,
  },
  course: {
    type: Number,
  },
  role: {
    type: String,
    default: "USER",
  },
});

const User = mongoose.model("User", userSchema);
module.exports = { User };
