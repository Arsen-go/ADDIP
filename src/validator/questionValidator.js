const Validator = require("./validator");
const { yup } = require("../constants");

class QuestionValidator extends Validator {
    async validateQuestion(headerText, text, keyWords, attachmentIds, faculty, course) {
        const schema = yup.object().shape({
            headerText: yup.string().min(5).required(),
            text: yup.string().min(5).required(),
            attachmentIds: yup.array(),
            faculty: yup.string(),
            course: yup.number().min(1).max(6),
        });
        await this.validateYupSchema(schema, { headerText, text, attachmentIds, faculty, course });
        await this.validateKeyWords(keyWords);
        await this.validateFaculty(faculty);
    };

    async validateEditQuestion(questionId, headerText, text, keyWords, attachmentIds, faculty, course) {
        const schema = yup.object().shape({
            questionId: yup.string().required(),
            headerText: yup.string().min(5),
            text: yup.string().min(5),
            attachmentIds: yup.array(),
            faculty: yup.string(),
            course: yup.number().min(1).max(6),
        });
        await this.validateYupSchema(schema, { questionId, headerText, text, attachmentIds, faculty, course });
        await this.validateKeyWords(keyWords);
        await this.validateFaculty(faculty);
    };

    async validateSkipAndLimit(skip, limit) {
        const schema = yup.object().shape({
            skip: yup.number().min(0).max(100),
            limit: yup.number().min(0).max(100),
        });
        await this.validateYupSchema(schema, { skip, limit });
    };

    async validateAnswer(questionId, answer) {
        const schema = yup.object().shape({
            questionId: yup.string().required(),
            answer: yup.string().min(2),
        });
        await this.validateYupSchema(schema, { questionId, answer });
    };

    async validateComment(questionId, text) {
        const schema = yup.object().shape({
            questionId: yup.string().required(),
            text: yup.string().required().min(2),
        });
        await this.validateYupSchema(schema, { questionId, text });
    };

    async validateVote(id, isGood) {
        const schema = yup.object().shape({
            id: yup.string().required(),
            isGood: yup.boolean().required(),
        });
        await this.validateYupSchema(schema, { id, isGood });
    }
};

module.exports = QuestionValidator;
