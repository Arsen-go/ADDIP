const Validator = require("./validator");
const { yup } = require("../constants");

class AttachmentValidator extends Validator {
    async validate({ contentType, fileId }) {
        await AttachmentValidator.validateContentType(contentType);
        await AttachmentValidator.validateKey(fileId);
    };

    async validateContentType(contentType) {
        const schema = yup.object().shape({
            contentType: yup.string().required(),
        });
        await this.validateYupSchema(schema, { contentType });
    };

    async validateKey(key) {
        const schema = yup.object().shape({
            key: yup.string().required(),
        });
        await this.validateYupSchema(schema, { key });
    };
};

module.exports = AttachmentValidator;