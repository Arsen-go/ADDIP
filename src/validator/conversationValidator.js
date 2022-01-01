const Validator = require("./validator");
const { yup } = require("../constants");

class ConversationValidator extends Validator {
    async validateConversation(title, desc, userId) {
        const schema = yup.object().shape({
            userId: yup.string(),
            title: yup.string().required(),
            desc: yup.string(),
        });
        await this.validateYupSchema(schema, { title, desc, userId });
    }
};

module.exports = ConversationValidator;