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

    async answerQuestion(currentUser, questionId, answer, attachmentIds) {
        const user = await User.findOne({ id: currentUser.id });
        const question = await Question.findOne({ id: questionId });
        if (!question) throw new ApolloError("Question is not found.", 404);
        const attachments = await Attachment.find({ id: attachmentIds });
        if (attachmentIds && !attachments && !attachmentIds.length) throw new ApolloError("Something went wrong with photos.", 404);
        const attachIds = attachments.map((attach) => attach.id);
        try {
            const newAnswer = new Answer({
                id: `ans_${uniqid()}`,
                text: answer,
                owner: user._id,
                attachment: attachIds,
                question: question._id
            });
            await newAnswer.save();
            question.answer.push(newAnswer._id);
            await question.save();
            return newAnswer;
        } catch (error) {
            throw new ApolloError(error);
        }
    };

    async setCorrectAnswer(currentUser, answerId) {
        const user = await User.findOne({ id: currentUser.id });
        const answer = await Answer.findOne({ id: answerId });
        if (!answer) throw new ApolloError("Something went wrong with answer.", 404);
        const question = await Question.findOne({ _id: answer.question });
        if (!question) throw new ApolloError("This question is already not exist.", 500);
        if (question.owner.toString() !== user._id.toString()) {
            throw new ApolloError("You don't have permission to set the correct answer for this question.")
        }
        try {
            answer.isThisTrue = true;
            await answer.save();
            question.isAnswered = true;
            question.userThatAnswered = answer.owner;
            await question.save();
        } catch (error) {
            throw new ApolloError(error);
        }
    };
};

module.exports = QuestionRepository;