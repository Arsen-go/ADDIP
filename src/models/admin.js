const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const adminSchema = new Schema({
  id: {
    type: String,
    unique: true,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  name: {
    type: String,
  },
  isApproved: {
    type: Boolean,
  },
  role: {
    type: String,
    required: true,
  }
});

const Admin = mongoose.model("Admin", adminSchema);
module.exports = { Admin };