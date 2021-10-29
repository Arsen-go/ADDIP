const { ValidationError, yup, emailValidator, phoneRegExp, moment } = require("../constants");

class Validator {
    async validatePhoneNumber(phone) {
        if (phone) {
            let schema = yup.object().shape({
                phone: yup.string().matches(phoneRegExp, "Phone number is not valid"),
            });

            try {
                await schema.strict().validate({ phone: phone });
            } catch (error) {
                throw new ValidationError(error.message);
            };
        }
    };

    async validateDate(date) {
        if (date && !moment(date, moment.ISO_8601, true).isValid()) {
            throw new ValidationError("Date object is not correct");
        }
    };

    async validateEmail(email) {
        if (email && !emailValidator.validate(email)) {
            throw new ValidationError("Email not correct");
        }
    };

    async validateYupSchema(schema, input) {
        try {
            await schema
                .strict()
                .validate(input);
        } catch (error) {
            throw new ValidationError(error.message);
        };
    };
};

module.exports = Validator;