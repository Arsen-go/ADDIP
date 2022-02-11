const { array } = require("yup/lib/locale");
const { uniqid, ApolloError, AWS, pubsub } = require("../constants");
const { Question, User, Answer, Attachment, Comment } = require("../models");
const s3 = new AWS.S3();

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
            pubsub.publish('questionAdded', { questionAdded: question, user: user });

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

    async onQuestionCreate(payload, variables, root) {
        try {
            return true;// here will be condition in what time to send a subscription data at the moment nondition is not required
        } catch (error) {
            console.log(error);
            return false;
        }
    };

    async isQuestionAnswered(payload, variables, root) {
        try {
            for (const qid of variables.questionIds) {
                const question = await Question.findOne({ id: qid });
                if (payload.questionAnswered.id === qid && payload.currentUser._id.toString() === question.owner.toString()) {
                    return true;
                }
            }

            return false;
        } catch (error) {
            throw new ApolloError(error);
        };
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

    async questions(skip, limit) {
        try {
            const questions = await Question.find().skip(skip).limit(limit);
            return questions;
        } catch (error) {
            throw new ApolloError(error, 500);
        }
    };

    async searchQuestions(text) {
        try {
            const questions = await Question.find({});
            let arr = [];
            for (const q of questions) {
                if (q.headerText.includes(text)) {
                    arr.push(q);
                }
            }
            return arr;
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

    async getAnswerOwner(answer) {
        try {
            return await User.findOne({ _id: answer.owner });
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
            pubsub.publish('questionAnswered', { questionAnswered: question, currentUser: user });

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

    async voteComment(currentUser, commentId) {
        try {
            const user = await User.findOne({ id: currentUser.id });
            const comment = await Comment.findOne({ id: commentId });
            if (!comment) throw ("Comment is not found or something went wrong.");
            const vote = comment.vote ? ++comment.vote : 1;
            comment.vote = vote;
            if (comment.votedUsers && comment.votedUsers.length) {
                comment.votedUsers.forEach((_id) => {
                    if (_id.toString() === user._id.toString()) {
                        throw ("You are already vote this comment.");
                    }
                });
            }
            comment.votedUsers.push(user._id);
            await comment.save();
            return comment;
        } catch (error) {
            throw new ApolloError(error, 500);
        }
    };

    async deleteQuestion(currentUser, questionId) {
        const user = await User.findOne({ id: currentUser.id });
        const question = await Question.findOne({ id: questionId, owner: user._id });
        if (!question) throw new ApolloError("Question is not yours and you can not delete it.");
        try {
            if (question.attachments && question.attachments.length) {
                await this._deleteAttachments(question.attachments);
            }
            if (question.comment && question.comment.length) {
                await this._deleteComments(question.comment);
            }
            for (let z = 0; z < question.answer.length; ++z) {
                const answer = await Answer.findOne({ _id: question.answer[z] });
                await this.deleteAnswer(currentUser, answer.id);
            }
            await Question.deleteOne({ id: question.id });
            return true;
        } catch (error) {
            throw new ApolloError(error, 500);
        }
    };

    async deleteComment(currentUser, commentId) {
        const user = await User.findOne({ id: currentUser.id });
        const comment = await Comment.findOne({ owner: user._id, id: commentId });
        if (!comment) throw new ApolloError("Comment is not your and you can not delete it.");

        try {
            if (comment.attachments && comment.attachments.length) {
                await this._deleteAttachments(comment.attachments);
            }
            if (comment.question) {
                await this._deleteCommentFromQuestion(comment.question, comment._id);
            }
            if (comment.answer) {
                await this._deleteCommentFromAnswer(comment.answer, comment._id);
            }
            await Comment.deleteOne({ _id: comment._id });
            return true;
        } catch (error) {
            throw new ApolloError(error, 500);
        }
    };

    async deleteAnswer(currentUser, answerId) {
        const answer = await Answer.findOne({ id: answerId });
        if (!answer) throw new ApolloError("Answer is not exist.");
        try {
            if (answer.attachments && answer.attachments.length) {
                await this._deleteAttachments(answer.attachments);
            }
            if (answer.comment && answer.comment.length) {
                await this._deleteComments(answer.comment);
            }
            const question = await Question.findOne({ _id: answer.question });
            if (question) {
                let idsWithout = [];
                question.answer.forEach((c) => {
                    if (c.toString() !== answer._id.toString()) {
                        idsWithout.push(c);
                    }
                });
                question.answer = idsWithout;
                if (answer.isThisTrue) {
                    question.userThatAnswered = null;
                }
                await question.save();
            }
            await Answer.deleteOne({ _id: answer._id });
            return true;
        } catch (error) {
            throw new ApolloError(error, 500);
        }
    };

    async getQuestionComments(question) {
        try {
            let comments = [];
            for (const commentId of question.comment) {
                comments.push(await Comment.findOne({ _id: commentId }));
            }
            return comments;
        } catch (error) {
            throw new ApolloError(error, 500);
        }
    };

    async getQuestionByObjectId(question_id) {
        try {
            return await Question.findOne({ _id: question_id });
        } catch (error) {
            throw new ApolloError(error);
        };
    };

    async getQuestion(questionId) {
        try {
            return await Question.findOne({ id: questionId });
        } catch (error) {
            throw new ApolloError(error);
        };
    };

    async getAnswersByQuestionId(questionId) {
        const question = await this.getQuestion(questionId);
        try {
            return await Answer.find({ question: question._id });
        } catch (error) {
            throw new ApolloError(error);
        };
    };

    async getAnswerComments(answer) {
        try {
            const comments = await Comment.find({ _id: answer.comment });
            return comments;
        } catch (error) {
            throw new ApolloError(error);
        };
    };

    async getUser(answer) {
        try {
            return await User.findOne({ _id: answer.owner });
        } catch (error) {
            throw new ApolloError(error);
        };
    };

    async getAnswer(answer_id) {
        try {
            return await Answer.findOne({ _id: answer_id });
        } catch (error) {
            throw new ApolloError(error);
        };
    };

    async _deleteComments(comment_Ids) {
        const comments = await Comment.find({ _id: comment_Ids });
        let attachments_Ids = [];
        for (let com of comments) {
            if (com.attachments && com.attachments.length) {
                com.attachments.forEach((c) => {
                    attachments_Ids.push(c);
                });
            }
        };
        if (attachments_Ids.length) {
            await this._deleteAttachments(attachments_Ids);
        }
        await Comment.deleteMany({ _id: comment_Ids });
    };

    async _deleteCommentFromQuestion(question_Id, comment_Id) {
        let question = await Question.findOne({ _id: question_Id });
        let idsWithout = [];
        question.comment.forEach((c) => {
            if (c.toString() !== comment_Id.toString()) {
                idsWithout.push(c);
            }
        });
        question.comment = idsWithout;
        await question.save();
    };

    async _deleteCommentFromAnswer(answer_Id, comment_Id) {
        let answer = await Answer.findOne({ _id: answer_Id });
        let idsWithout = [];
        answer.comment.forEach((c) => {
            if (c.toString() !== comment_Id.toString()) {
                idsWithout.push(c);
            }
        });
        answer.comment = idsWithout;
        await answer.save();
    };

    async _deleteAttachments(attachment_Ids) {
        const attachments = await Attachment.find({ _id: attachment_Ids });
        attachments.forEach((attach) => {
            let params = { Bucket: "aws_bucket_for_app", Key: attach.fileId };

            s3.deleteObject(params, (err) => {
                if (err) console.log(err);
                else console.log("deleted");
            });
        });
        await Attachment.deleteMany({ _id: attachment_Ids });
    };

    async _getAttachmentObjectIds(attachmentIds) {
        const attachments = await Attachment.find({ id: attachmentIds });
        if (attachmentIds && !attachments && !attachments.length) throw new ApolloError("Something went wrong with photos.", 404);
        const attachIds = attachments.map((attach) => attach.id);
        return attachIds;
    };
};

module.exports = QuestionRepository;