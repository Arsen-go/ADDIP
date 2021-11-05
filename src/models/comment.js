const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CommentSchema = new Schema({
    id: {
        type: String,
        required: true
    },
    text: {
        type: String,
    },
    vote: {
        type: Number,
    },
    views: {
        type: Number,
    },
    owner: { type: Schema.Types.ObjectId, ref: "User", required: true },
    attachment: [{ type: Schema.Types.ObjectId, ref: "Attachment" }],
    answer: { type: Schema.Types.ObjectId, ref: "Answer" },
}, { timestamps: true });

const Comment = mongoose.model("Comment", CommentSchema);
module.exports = { Comment };
