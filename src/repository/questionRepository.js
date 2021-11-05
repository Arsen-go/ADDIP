const { uniqid, ApolloError } = require("../constants");
const { Question, User, Answer, Attachment } = require("../models");

class QuestionRepository {
    async createQuestion(currentUser, headerText, text, keyWords, attachmentIds, faculty, course) {
        const user = await User.findOne({ id: currentUser.id });
        try {
            const question = new Question({
                id: `q_${uniqid()}`,
                headerText,
                text,
                keyWords,
                attachmentIds,
                faculty,
                course,
                owner: user._id
            });
            await question.save();
            return question;
        } catch (error) {
            throw new ApolloError(error);
        }
    };

    async userQuestions(currentUser, skip, limit) {
        const user = await User.findOne({ id: currentUser.id });
        try {
            const questions = await Question.find({ owner: user._id }).skip(skip).limit(limit);
            return questions;
        } catch (error) {
            throw new ApolloError(error);
        }
    };

    async getQuestionOwner(question) {
        try {
            return await User.findOne({ _id: question.owner });
        } catch (error) {
            throw new ApolloError(error);
        }
    };

    async getQuestionAnswers(question) {
        try {
            return await Answer.find({ _id: question.answer });
        } catch (error) {
            throw new ApolloError(error);
        }
    };

    async getQuestionAttachments(question) {
        try {
            return await Attachment.find({ _id: question.attachments });
        } catch (error) {
            throw new ApolloError(error);
        }
    };
};

module.exports = QuestionRepository;