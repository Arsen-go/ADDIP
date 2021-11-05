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
    };
};

module.exports = QuestionResolver;
