const { uniqid, ApolloError } = require("../constants");
const { Question, User, Answer, Attachment, Comment } = require("../models");

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
            throw new ApolloError(error, 500);
        }
    };

    async editQuestion(currentUser, questionId, headerText, text, keyWords, attachmentIds, faculty, course) {
        const user = await User.findOne({ id: currentUser.id });
        try {
            const question = await Question.findOne({ id: questionId });
            if (!question) throw ("Question is not found or something went wrong");
            const editedQuestion = await Question.findOneAndUpdate({ _id: question._id }, {
                headerText, text, keyWords, attachmentIds, faculty, course
            }, { upsert: true });
            return editedQuestion;
        } catch (error) {
            throw new ApolloError(error, 500);
        }
    };

    async userQuestions(currentUser, skip, limit) {
        const user = await User.findOne({ id: currentUser.id });
        try {
            const questions = await Question.find({ owner: user._id }).skip(skip).limit(limit);
            return questions;
        } catch (error) {
            throw new ApolloError(error, 500);
        }
    };

    async getQuestionOwner(question) {
        try {
            return await User.findOne({ _id: question.owner });
        } catch (error) {
            throw new ApolloError(error, 500);
        }
    };

    async getQuestionAnswers(question) {
        try {
            return await Answer.find({ _id: question.answer });
        } catch (error) {
            throw new ApolloError(error, 500);
        }
    };

    async getQuestionAttachments(question) {
        try {
            return await Attachment.find({ _id: question.attachments });
        } catch (error) {
            throw new ApolloError(error, 500);
        }
    };

    async answerQuestion(currentUser, questionId, answer, attachmentIds) {
        const user = await User.findOne({ id: currentUser.id });
        const question = await Question.findOne({ id: questionId });
        if (!question) throw new ApolloError("Question is not found.", 404);

        try {
            const attachIds = await this._getAttachmentObjectIds(attachmentIds);
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
            throw new ApolloError(error, 500);
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
        if (question.answer && question.answer.length) {
            const answers = await Answer.find({ _id: question.answer });
            for (let a of answers) {
                if (a.isThisTrue) {
                    a.isThisTrue = false;
                    await a.save();
                    break;
                }
            }
        }
        try {
            answer.isThisTrue = true;
            await answer.save();
            question.isAnswered = true;
            question.userThatAnswered = answer.owner;
            await question.save();
        } catch (error) {
            throw new ApolloError(error, 500);
        }
    };

    async addCommentToQuestion(currentUser, questionId, text, attachmentIds) {
        const user = await User.findOne({ id: currentUser.id });
        const question = await Question.findOne({ id: questionId });
        if (!question) throw new ApolloError("Question is not found or something went wrong.", 404);
        try {
            const attachIds = await this._getAttachmentObjectIds(attachmentIds);
            const questionComment = new Comment({
                id: `qscom_${uniqid()}`,
                text,
                owner: user._id,
                attachments: attachIds,
                question: question._id,
            });
            await questionComment.save();
            question.comment.push(questionComment._id);
            await question.save();
            return questionComment;
        } catch (error) {
            throw new ApolloError(error, 500);
        }
    };

    async addCommentToAnswer(currentUser, answerId, text, attachmentIds) {
        const user = await User.findOne({ id: currentUser.id });
        const answer = await Answer.findOne({ id: answerId });
        if (!answer) throw new ApolloError("Answer is not found or si=omething went wrong.", 404);

        try {
            const attachIds = await this._getAttachmentObjectIds(attachmentIds);
            const answerComment = new Comment({
                id: `ascom_${uniqid()}`,
                text,
                owner: user._id,
                attachments: attachIds,
                answer: answer._id,
            });
            await answerComment.save();
            answer.comment.push(answerComment._id);
            await answer.save();
            return answerComment;
        } catch (error) {
            throw new ApolloError(error, 500);
        }
    };

    async voteQuestion(currentUser, questionId) {
        const user = await User.findOne({ id: currentUser.id });
        const question = await Question.findOne({ id: questionId });
        if (!question) throw new ApolloError("Question is not found or something went wrong.");

        try {
            const vote = question.vote ? ++question.vote : 1;
            question.vote = vote;
            if (question.votedUsers && question.votedUsers.length) {
                question.votedUsers.forEach((_id) => {
                    if (_id.toString() === user._id.toString()) {
                        throw ("You are already vote this question.");
                    }
                });
            }
            question.votedUsers.push(user._id);
            await question.save();
            return question;
        } catch (error) {
            throw new ApolloError(error, 500);
        }
    };

    async voteAnswer(currentUser, answerId) {
        try {
            const user = await User.findOne({ id: currentUser.id });
            const answer = await Answer.findOne({ id: answerId });
            if (!answer) throw ("Answer is not found or something went wrong.");

            const vote = answer.vote ? ++answer.vote : 1;
            answer.vote = vote;
            if (answer.votedUsers && answer.votedUsers.length) {
                answer.votedUsers.forEach((_id) => {
                    if (_id.toString() === user._id.toString()) {
                        throw ("You are already vote this answer.");
                    }
                });
            }
            answer.votedUsers.push(user._id);
            await answer.save();
            return answer;
        } catch (error) {
            throw new ApolloError(error, 500);
        }
    };

    async _getAttachmentObjectIds(attachmentIds) {
        const attachments = await Attachment.find({ id: attachmentIds });
        if (attachmentIds && !attachments && !attachments.length) throw new ApolloError("Something went wrong with photos.", 404);
        const attachIds = attachments.map((attach) => attach.id);
        return attachIds;
    };
};

module.exports = QuestionRepository;