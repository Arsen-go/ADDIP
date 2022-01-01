const Validator = require("./validator");
const { yup } = require("../constants");

class MessageValidator extends Validator {
    async validateMessage(message, conversationId) {
        const schema = yup.object().shape({
            message: yup.string().required(),
            conversationId: yup.string().required(),
        });
        await this.validateYupSchema(schema, { message, conversationId });
    };
};

module.exports = MessageValidator;