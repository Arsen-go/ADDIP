const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const MessageLookedDateSchema = new Schema({
  id: {
    type: String,
    unique: true,
    required: true
  },
  createdDate: {
    type: Date,
    required: true
  },
  message: { type: Schema.Types.ObjectId, ref: 'Message' },
  user: { type: Schema.Types.ObjectId, ref: 'User' },
});

const MessageLookedDate = mongoose.model('MessageLookedDate', MessageLookedDateSchema);
module.exports = { MessageLookedDate };