const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const AttachmentSchema = new Schema({
  id: {
    type: String,
    unique: true,
    required: true
  },
  fileId: {
    type: String,
  },
  contentType: {
    type: String,
  },
  createdDate: {
    type: Date,
  },
  pixelWidth: {
    type: Number,
  },
  pixelHeight: {
    type: Number,
  },
  size: {
    type: Number,
  },
  name: {
    type: String,
  },
});

const Attachment = mongoose.model("Attachment", AttachmentSchema);
module.exports = { Attachment };
