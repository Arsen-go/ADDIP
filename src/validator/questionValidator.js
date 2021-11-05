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

    async validateSkipAndLimit(skip, limit) {
        const schema = yup.object().shape({
            skip: yup.number().min(0).max(100),
            limit: yup.number().min(0).max(100),
        });
        await this.validateYupSchema(schema, { skip, limit });
    };
};

module.exports = QuestionValidator;
