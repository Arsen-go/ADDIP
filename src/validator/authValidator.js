const Validator = require("./validator");

class AuthValidator extends Validator {
    async validate(email) {
        await this.validateEmail(email);
    };
};

module.exports = AuthValidator;