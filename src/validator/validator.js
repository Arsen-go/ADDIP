const { ValidationError, yup, emailValidator, phoneRegExp, moment } = require("../constants");

class Validator {
    keyWords = [];
    faculties = [];
    constructor() {
        this.keyWords = ["JS", "JavaScript", "C++"];
        this.faculties = ["IKM"]
    };

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

    async validateKeyWords(keyWords) {
        if (!keyWords) return;
        keyWords.map((word) => {
            if (!this.keyWords.includes(word)) throw new ValidationError(`${word} is not a key word.`);
        });
    };

    async validateFaculty(faculty) {
        if(!faculty) return;
        if(!this.faculties.includes(faculty)) throw new ValidationError(`${faculty} is not a valid faculty.`);
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