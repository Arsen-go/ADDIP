const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const QuestionSchema = new Schema({
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
    isAnswered: {
        type: Boolean,
    },
    keyWords: [{
        type: String,
    }],
    headerText: {
        type: String,
    },
    faculty: {
        type: String,
    },
    course: {
        type: Number,
    },
    userThatAnswered: { type: Schema.Types.ObjectId, ref: "User" },
    answer: [{ type: Schema.Types.ObjectId, ref: "Answer" }],
    owner: { type: Schema.Types.ObjectId, ref: "User" },
    attachments: [{ type: Schema.Types.ObjectId, ref: "Attachment" }],
}, { timestamps: true });

const Question = mongoose.model("Question", QuestionSchema);
module.exports = { Question };
