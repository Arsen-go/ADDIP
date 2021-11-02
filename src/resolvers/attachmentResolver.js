require('dotenv').config();
const { ApolloError } = require('../constants');
const { authenticated, roleAuthentication } = require('../auth');
const { User, Attachment } = require('../models');

let validator, repository;

class AttachmentResolver {
    constructor(validatorObject, attachmentRepository) {
        validator = validatorObject;
        repository = attachmentRepository;
    };

    Query = {
        profileAttachments: authenticated(async (_, { id }) => {
            return await Attachment.find({ owner: id });
        }),
    };

    Attachment = {
        owner: async (attachment) => {
            let result = await User.findOne({ id: attachment.owner });
            return result.id;
        },

        downloadLink: async (attachment) => {
            await validator.validateKey(attachment.fileId);
            return await repository.downloadLink(attachment);
        },

        uploadLink: async (attachment) => {
            await validator.validateContentType(attachment.contentType);
            return await repository.uploadLink(attachment);
        },
    };

    Mutation = {
        createAttachment: roleAuthentication(["USER"], async (_, args, { currentUser }) => {
            await validator.validateContentType(args.contentType);
            return await repository.createAttachment(args, currentUser);
        }),
    };
};


module.exports = AttachmentResolver;