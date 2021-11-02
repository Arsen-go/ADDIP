const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const mailTokenSchema = new Schema({
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

const EmailToken = mongoose.model("EmailToken", mailTokenSchema);
module.exports = { EmailToken };