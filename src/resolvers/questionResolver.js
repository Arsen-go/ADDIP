const { roleAuthentication } = require("../auth");

let validator, repository;

class QuestionResolver {
    constructor(questionValidator, questionRepository) {
        validator = questionValidator;
        repository = questionRepository;
    };

    Query = {
        userQuestions: roleAuthentication(["USER"], async (_, args, { currentUser }) => {
            const { skip, limit } = args;
            await validator.validateSkipAndLimit(skip, limit);
            return await repository.userQuestions(currentUser, skip, limit);
        }),

        questions: roleAuthentication(["USER"], async (_, args) => {
            const { skip, limit } = args;
            await validator.validateSkipAndLimit(skip, limit);
            return await repository.questions(skip, limit);
        }),

        searchQuestions: roleAuthentication(["USER"], async (_, args) => {
            const { text } = args;
            return await repository.searchQuestions(text);
        }),
    };

    Question = {
        owner: async (question) => await repository.getQuestionOwner(question),

        answer: async (question) => await repository.getQuestionAnswers(question),

        attachments: async (question) => await repository.getQuestionAttachments(question),
    };

    Mutation = {
        createQuestion: roleAuthentication(["USER"], async (_, args, { currentUser }) => {
            const { headerText, text, keyWords, attachmentIds, faculty, course } = args;
            await validator.validateQuestion(headerText, text, keyWords, attachmentIds, faculty, course);
            return await repository.createQuestion(currentUser, headerText, text, keyWords, attachmentIds, faculty, course);
        }),

        editQuestion: roleAuthentication(["USER"], async (_, args, { currentUser }) => {
            const { questionId, headerText, text, keyWords, attachmentIds, faculty, course } = args;
            await validator.validateEditQuestion(questionId, headerText, text, keyWords, attachmentIds, faculty, course);
            return await repository.editQuestion(currentUser, questionId, headerText, text, keyWords, attachmentIds, faculty, course);
        }),

        answerQuestion: roleAuthentication(["USER"], async (_, args, { currentUser }) => {
            const { questionId, answer, attachmentIds } = args;
            await validator.validateAnswer(questionId, answer);
            return await repository.answerQuestion(currentUser, questionId, answer, attachmentIds);
        }),

        setCorrectAnswer: roleAuthentication(["USER"], async (_, args, { currentUser }) => {
            const { answerId } = args;
            return await repository.setCorrectAnswer(currentUser, answerId);
        }),

        addCommentToQuestion: roleAuthentication(["USER"], async (_, args, { currentUser }) => {
            const { questionId, text, attachmentIds } = args;
            await validator.validateComment(questionId, text);
            return await repository.addCommentToQuestion(currentUser, questionId, text, attachmentIds);
        }),

        addCommentToAnswer: roleAuthentication(["USER"], async (_, args, { currentUser }) => {
            const { answerId, text, attachmentIds } = args;
            await validator.validateComment(answerId, text);
            return await repository.addCommentToAnswer(currentUser, answerId, text, attachmentIds);
        }),

        voteQuestion: roleAuthentication(["USER"], async (_, args, { currentUser }) => {
            const { questionId } = args;
            return await repository.voteQuestion(currentUser, questionId);
        }),

        voteAnswer: roleAuthentication(["USER"], async (_, args, { currentUser }) => {
            const { answerId } = args;
            return await repository.voteAnswer(currentUser, answerId);
        }),

        voteComment: roleAuthentication(["USER"], async (_, args, { currentUser }) => {
            const { commentId } = args;
            return await repository.voteComment(currentUser, commentId);
        }),

        deleteComment: roleAuthentication(["USER"], async (_, args, { currentUser }) => {
            const { commentId } = args;
            return await repository.deleteComment(currentUser, commentId);
        }),

        deleteAnswer: roleAuthentication(["USER"], async (_, args, { currentUser }) => {
            const { answerId } = args;
            return await repository.deleteAnswer(currentUser, answerId);
        }),
    };
};

module.exports = QuestionResolver;
