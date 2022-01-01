const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ConversationSchema = new Schema({
  id: {
    type: String,
    unique: true,
    required: true
  },
  createdDate: {
    type: Date,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  desc: {
    type: String,
    required: true
  },
  isIndividual: {
    type: Boolean,
    default: false
  },
  isPrivate: {
    type: Boolean,
    default: false
  },

  attachment: { type: Schema.Types.ObjectId, ref: 'Attachment' },
  users: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  owner: { type: Schema.Types.ObjectId, ref: 'User', required: true },
});

const Conversation = mongoose.model('Conversation', ConversationSchema);
module.exports = { Conversation };
