const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const MessageSchema = new Schema({
  id: {
    type: String,
    unique: true,
    required: true
  },
  message: {
    type: String,
    required: false
  },
  createdDate: {
    type: Date,
    required: true
  },
  messageType: {
    type: String,
  },
  participants: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  lookedUsers: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  lookedDates: [{ type: Schema.Types.ObjectId, ref: 'MessageLookedDate' }],
  attachments: [{ type: Schema.Types.ObjectId, ref: 'Attachment' }],
  conversation: { type: Schema.Types.ObjectId, ref: 'Conversation', required: true },
  owner: { type: Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

const Message = mongoose.model('Message', MessageSchema);
module.exports = { Message };
