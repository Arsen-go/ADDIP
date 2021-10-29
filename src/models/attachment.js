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
  durationSeconds: {
    type: Number,
  },
  name: {
    type: String,
  },
  owner: {
    type: String,
    required: true
  }//ref chi => erku attachment ka kam user-in kam driverin u type mej dra hamar string em veradardznum
  // owner: { type: Schema.Types.ObjectId, ref: "User", required: true },
});

const Attachment = mongoose.model("Attachment", AttachmentSchema);
module.exports = { Attachment };
