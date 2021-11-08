const Validator = require("./validator");
const { yup } = require("../constants");

class AdminValidator extends Validator {
    async validateSignIn(email, password) {
        const schema = yup.object().shape({
            email: yup.string().min(5).max(100),
            password: yup.string().min(5).max(100),
        });
        await this.validateYupSchema(schema, { email, password });
        await this.validateEmail(email);
    }
};

module.exports = AdminValidator;