const { roleAuthentication } = require('../auth');
const { User, Conversation, MessageLookedDate } = require('../models');
const { pubsub, withFilter } = require("../constants");

let validator, repository;

class MessageResolver {
    constructor({ messageValidator, messageRepository }) {
        validator = messageValidator;
        repository = messageRepository;
    };

    Subscription = {
        messageAdded: {
            subscribe: withFilter((_, variables, context) => pubsub.asyncIterator('messageAdded'),
                async (payload, variables, root) => {
                    return await repository.onMessageCreateDelete(payload, variables, root);
                }
            )
        },
    }

    Query = {
        messagesByConversationId: roleAuthentication(["USER", "WORKER"], async (_, args, { currentUser }) => {
            const { conversationId, skip, limit } = args;
            return await repository.getMessagesByConversationId(currentUser, conversationId, skip, limit);
        }),
    };

    Message = {
        owner: async (message) => {
            try {
                return await User.findOne({ _id: message.owner })
            } catch (error) {
                throw new ApolloError(error, 555);
            }
        },

        conversation: async (message) => {
            try {
                return await Conversation.findOne({ _id: message.conversation });
            } catch (error) {
                throw new ApolloError(error, 555);
            }
        },

        lookedUsers: async (message) => {
            try {
                return await User.find({ _id: message.lookedUsers });
            } catch (error) {
                throw new ApolloError(error, 555);
            }
        },

        lookedDates: async (message) => {
            try {
                return await MessageLookedDate.find({ _id: message.lookedDates });
            } catch (error) {
                throw new ApolloError(error, 555);
            }
        },
    };

    Mutation = {
        createMessage: roleAuthentication(["USER"], async (_, args, { currentUser }) => {
            const { message, conversationId } = args;
            await validator.validateMessage(message, conversationId);
            return await repository.createMessage(message, conversationId, currentUser);
        }),
    };
};

module.exports = MessageResolver;