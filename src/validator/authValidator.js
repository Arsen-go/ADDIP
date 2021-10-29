const Validator = require("./validator");

class AuthValidator extends Validator {
    async validate(phone) {
        await this.validatePhoneNumber(phone);
    };
};

module.exports = AuthValidator;