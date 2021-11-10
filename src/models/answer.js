const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const AnswerSchema = new Schema({
    id: {
        type: String,
        required: true
    },
    text: {
        type: String,
        required: true
    },
    vote: {
        type: Number,
    },
    views: {
        type: Number,
    },
    isThisTrue: {
        type: Boolean,
    },
    comment: [{ type: Schema.Types.ObjectId, ref: "Comment" }],
    owner: { type: Schema.Types.ObjectId, ref: "User", required: true },
    attachments: [{ type: Schema.Types.ObjectId, ref: "Attachment" }],
    question: { type: Schema.Types.ObjectId, ref: "Question", required: true },
    votedUsers: [{ type: Schema.Types.ObjectId, ref: "User" }],
}, { timestamps: true });

const Answer = mongoose.model("Answer", AnswerSchema);
module.exports = { Answer };
