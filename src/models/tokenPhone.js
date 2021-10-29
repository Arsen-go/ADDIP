const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const phoneTokenSchema = new Schema({
  id: {
    type: String, 
    unique: true,
    required: true
  },
  token: {
    type: String,
    required: true
  },
  phone: {
    type: String,
  },
  for: {
    type: String,
  },
  createdDate: {
    type: Date,
    required: true
  },
});

const TokenPhone = mongoose.model("TokenPhone", phoneTokenSchema);
module.exports = { TokenPhone };