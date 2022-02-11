const { ApolloError } = require("apollo-server-core");
const { roleAuthentication } = require("../auth");
const { Message } = require("../models");

let validator, repository;

class ConversationResolver {
    constructor({ conversationValidator, conversationRepository }) {
        validator = conversationValidator;
        repository = conversationRepository;
    };

    Query = {
        getConversations: roleAuthentication(["USER"], async (_, { }, { currentUser }) => {
            return await repository.getMyConversations(currentUser);
        }),

        conversationById: roleAuthentication(["USER"], async (_, { conversationId }) => {
            return await repository.getConversationById(conversationId);
        }),
    };

    Conversation = {
        async messages(conversation) {
            try {
                return await Message.find({ conversation: conversation._id });
            } catch (error) {
                throw new ApolloError(error);
            }
        }
    };

    Mutation = {
        createConversation: roleAuthentication(["USER"], async (_, { title, desc, userId }, { currentUser }) => {
            await validator.validateConversation(title, desc, userId);
            return await repository.createConversation(currentUser, title, desc, userId);
        }),
    };
};


module.exports = ConversationResolver;