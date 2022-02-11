const Validator = require("./validator");
const { yup } = require("../constants");

class PollValidator extends Validator {
    async validatePoll({ options, question, duration }) {
        const schema = yup.object().shape({
            options: yup.array().required(),
            question: yup.string().required(),
            duration: yup.date()
        });
        await this.validateYupSchema(schema, { options, question, duration });
    };
};

module.exports = PollValidator;