const { roleAuthentication } = require('../auth');
const { Message, User, Conversation, MessageLookedDate } = require('../models');
const { pubsub, withFilter } = require("../constants");
// const { ValidationError, ApolloError, ForbiddenError } = require('apollo-server');
// const { authenticated } = require('../auth');
// const { Pusher } = require('../middlewares/pusher')
// const { pubsub } = require('../middlewares/pubsub')

let validator, repository;

class MessageResolver {
    constructor(messageValidator, messageRepository) {
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
    //         messageForWorkspaceUsers: {
    //             subscribe: withFilter(() => pubsub.asyncIterator('messageForWorkspaceUsers'),
    //                 async (payload, variables, root) => {
    //                     return await repository.messageForWorkspaceUsers(payload, variables, root);
    //                 }
    //             )
    //         },
    //         messagesStatusChanged: {
    //             subscribe: withFilter(() => pubsub.asyncIterator('messagesStatusChanged'),
    //                 async (payload, variables, root, args, context, info) => {
    //                     return payload.conversationId === variables.conversationId;
    //                 }
    //             )
    //         },
    //         userCallStatusChanged: {
    //             subscribe: withFilter(() => pubsub.asyncIterator('userCallStatusChanged'),
    //                 async (payload, variables, root, args, context, info) => {
    //                     try {
    //                         const user = await User.findOne({ phone: root.currentUser.phone });
    //                         return payload.to === user.id || payload.from == user.id;
    //                     } catch (error) {
    //                         console.log(error);
    //                         return false;
    //                     }
    //                 }
    //             )
    //         },

    //         deletedMessages: {
    //             subscribe: withFilter((_, variables, context) => pubsub.asyncIterator('deletedMessages'),
    //                 async (payload, variables, root) => {
    //                     return await repository.onMessageCreateDelete(payload, variables, root);
    //                 },
    //             ),
    //         },

    //         deletedMessageForWorkspaceUsers: {
    //             subscribe: withFilter(() => pubsub.asyncIterator('deletedMessageForWorkspaceUsers'),
    //                 async (payload, variables, root) => {
    //                     return await repository.messageForWorkspaceUsers(payload, variables, root);
    //                 },
    //             ),
    //         },
    //     };

    //     MessageLookedDate = {
    //         async user(messageLookedDate) {
    //             try {
    //                 return await User.findOne({ _id: messageLookedDate.user })
    //             } catch (error) {
    //                 throw new ApolloError(error.message);
    //             }
    //         },
    //     };

    Query = {
        messagesByConversationId: roleAuthentication(["USER", "WORKER"], async (_, args, { currentUser }) => {
            const { conversationId, skip, limit } = args;
            return await repository.getMessagesByConversationId(currentUser, conversationId, skip, limit);
        }),
    };
    //         allMessages: authenticated(async (root, { }, context) => {
    //             const user = context.currentUser;
    //             try {
    //                 const conversations = await Conversation.find({ $and: [{ users: user._id }] });
    //                 const conversationIds = conversations.map(c => { return c._id });
    //                 const deletedMessages = await DeletedMessage.find({ owner: user._id, conversation: conversationIds });
    //                 const delMessageIds = deletedMessages.map(doc => { return doc.message });
    //                 const messages = await Message.find({ _id: { $nin: delMessageIds ? delMessageIds : null }, conversation: conversationIds }).limit(5000);

    //                 return messages;
    //             } catch (error) {
    //                 throw new ApolloError(error)
    //             }
    //         }),

    //         searchMessages: authenticated(async (root, { message }, context) => {
    //             // Validation
    //             const schema = yup.object().shape({
    //                 message: yup.string().required(),
    //             });

    //             try {
    //                 await schema.strict().validate({ message })
    //             } catch (error) {
    //                 throw new ValidationError(error.message);
    //             }

    //             const user = context.currentUser;

    //             try {
    //                 const conversations = await Conversation.find({ $and: [{ users: user._id }] });
    //                 const conversationIds = conversations.map(c => { return c._id });
    //                 const deletedMessages = await DeletedMessage.find({ owner: user._id, conversation: conversationIds });
    //                 const delMessageIds = deletedMessages.map(doc => { return doc.message });

    //                 const messages = await Message.find({ $and: [{ _id: { $nin: delMessageIds ? delMessageIds : null } }, { message: { $regex: '.*' + message + '.*', $options: 'i' } }, { messageType: { $ne: "INVITE_NOT_ACCEPTED" } }, { messageType: { $ne: "INVITED_MESSAGE" } }], conversation: conversationIds }).limit(500);;

    //                 return messages;
    //             } catch (error) {
    //                 throw new ApolloError(error)
    //             }
    //         }),

    //         searchMessagesByWorkspaceId: authenticated(async (root, { message, workspaceId }, context) => {
    //             // Validation
    //             const schema = yup.object().shape({
    //                 message: yup.string().required(),
    //                 workspaceId: yup.string().required(),
    //             });

    //             try {
    //                 await schema.strict().validate({ message, workspaceId })
    //             } catch (error) {
    //                 throw new ValidationError(error.message);
    //             }

    //             const user = context.currentUser;

    //             const workspace = await Workspace.findOne({ $and: [{ id: workspaceId }, { users: user._id }] });
    //             if (!workspace) {
    //                 throw new ForbiddenError("Workspace not exist or you don't have permission");
    //             }

    //             try {
    //                 const conversations = await Conversation.find({ $and: [{ users: user._id }, { workspace: workspace._id }] });
    //                 const conversationIds = conversations.map(c => { return c._id });
    //                 const deletedMessages = await DeletedMessage.find({ owner: user._id, conversation: conversationIds });
    //                 const delMessageIds = deletedMessages.map(doc => { return doc.message });
    //                 const messages = await Message.find({ $and: [{ _id: { $nin: delMessageIds ? delMessageIds : null } }, { message: { $regex: '.*' + message + '.*', $options: 'i' } }, { messageType: { $ne: "INVITE_NOT_ACCEPTED" } }, { messageType: { $ne: "INVITED_MESSAGE" } }], conversation: conversationIds }).limit(500);;

    //                 return messages;
    //             } catch (error) {
    //                 throw new ApolloError(error)
    //             }
    //         }),

    //         searchConversationByWorkspaceIds: authenticated(async (root, { conversation, workspaceIds }, context) => {
    //             // Validation
    //             const schema = yup.object().shape({
    //                 conversation: yup.string().required(),
    //                 workspaceIds: yup.array().of(yup.string().required())
    //             });

    //             try {
    //                 await schema.strict().validate({ conversation, workspaceIds })
    //             } catch (error) {
    //                 throw new ValidationError(error.conversation);
    //             }

    //             const user = context.currentUser;
    //             const workspaces = await Workspace.find({ $and: [{ id: workspaceIds }, { users: user._id }] });

    //             try {
    //                 let conversations = [];

    //                 for (let i = 0; i < workspaces.length; i++) {
    //                     let workspace = workspaces[i];
    //                     const workspaceConversations = await Conversation.find({ $and: [{ users: user._id }, { workspace: workspace._id }, { title: { $regex: '.*' + conversation + '.*', $options: 'i' } }] });
    //                     conversations.push(...workspaceConversations);
    //                 }
    //                 return conversations;
    //             } catch (error) {
    //                 throw new ApolloError(error)
    //             }
    //         }),

    //         searchMessagesByConversationId: authenticated(async (root, { message, conversationId }, context) => {
    //             // Validation
    //             const schema = yup.object().shape({
    //                 message: yup.string().required(),
    //                 conversationId: yup.string().required(),
    //             });

    //             try {
    //                 await schema.strict().validate({ message, conversationId })
    //             } catch (error) {
    //                 throw new ValidationError(error.message);
    //             }

    //             const conversation = await Conversation.findOne({ $and: [{ id: conversationId }] });
    //             if (!conversation) {
    //                 throw new ForbiddenError("Workspace not exist or you don't have permission");
    //             }

    //             try {
    //                 const conversations = [conversation];
    //                 const conversationIds = conversations.map(c => { return c._id });
    //                 const user = context.currentUser;
    //                 const deletedMessages = await DeletedMessage.findOne({ owner: user._id, conversation: conversation._id });
    //                 const messages = await Message.find({ $and: [{ _id: { $nin: deletedMessages ? deletedMessages.message : null } }, { message: { $regex: '.*' + message + '.*', $options: 'i' } }, { messageType: { $ne: "INVITE_NOT_ACCEPTED" } }, { messageType: { $ne: "INVITED_MESSAGE" } }], conversation: conversationIds }).limit(500);;

    //                 return messages;
    //             } catch (error) {
    //                 throw new ApolloError(error)
    //             }
    //         }),

    //         messagesByLimitPoint: authenticated(async (root, { conversationId, limitPointId, ascending, skip, limit }, context) => {
    //             try {
    //                 const conversation = await Conversation.findOne({ id: conversationId });
    //                 if (!conversation) {
    //                     throw new ForbiddenError(translate('This group no longer exists.', `${context.country()}`));
    //                 }

    //                 const conversationIds = [conversation._id];

    //                 const message = await Message.findOne({ $and: [{ id: `${limitPointId}` }, { conversation: conversationIds }] });
    //                 if (!message) {
    //                     throw new ForbiddenError("Limit point message not exist");
    //                 }

    //                 let messages = [];
    //                 const user = context.currentUser;
    //                 const deletedMessages = await DeletedMessage.findOne({ owner: user._id, conversation: conversation._id });

    //                 if (ascending) {
    //                     const createdDateQuery = { createdDate: { $gte: message.createdDate } };
    //                     messages = await Message.find({ $and: [{ _id: { $nin: deletedMessages ? deletedMessages.message : null } }, createdDateQuery, { conversation: conversationIds }] }).skip(skip).limit(limit);
    //                 } else {
    //                     const createdDateQuery = { createdDate: { $lte: message.createdDate } };
    //                     messages = await Message.find({ $and: [{ _id: { $nin: deletedMessages ? deletedMessages.message : null } }, createdDateQuery, { conversation: conversationIds }] }).sort({ createdDate: -1 }).skip(skip).limit(limit);
    //                 }

    //                 return messages;
    //             } catch (error) {
    //                 throw new ApolloError(error)
    //             }
    //         }),

    //         message: authenticated(async (root, { messageId }, context) => {
    //             try {
    //                 const message = await Message.findOne({ id: messageId });
    //                 const user = context.currentUser;
    //                 const deletedMessages = await DeletedMessage.findOne({ owner: user._id, conversation: message.conversation });
    //                 if (!message || (deletedMessages && deletedMessages.message.includes(message._id))) {
    //                     throw new ForbiddenError("Message not exist");
    //                 }

    //                 return message;
    //             } catch (error) {
    //                 throw new ApolloError(error)
    //             }
    //         }),

    //         messages: authenticated(async (root, { conversationId, limit }, context) => {
    //             const user = context.currentUser;
    //             const conversation = await Conversation.findOne({ id: conversationId });
    //             if (!conversation) {
    //                 throw new ForbiddenError(translate('This group no longer exists.', `${user.country}`));
    //             }

    //             const role = await Role.findOne({ $and: [{ workspace: conversation.workspace }, { owner: user._id }] })
    //             if (!role) {
    //                 throw new ForbiddenError(translate(`Sorry, you don't have access to`, `${user.country}`, { groupName: conversation.title }));
    //             }
    //             const deletedMessages = await DeletedMessage.findOne({ owner: user._id, conversation: conversation._id });
    //             try {
    //                 const messages = await Message.find({ _id: { $nin: deletedMessages ? deletedMessages.message : null }, conversation: conversation._id }).sort({ createdDate: -1 }).limit(limit);

    //                 repository.setLookedConversationMessagesBySimpleParameters(conversation.id, user.phone)

    //                 return messages;
    //             } catch (error) {
    //                 throw new ApolloError(error)
    //             }
    //         })
    //     };

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

    //         deleteMessages: authenticated(async (root, { messageIds }) => {    
    //             await repository.deleteMessages(messageIds);
    //         }),

    //         deleteMessagesForMe: authenticated(async (_, { messageIds, conversationId }, context) => {
    //             await repository.deleteMessageForMe(messageIds, conversationId, context);
    //         }),

    //         shareMessages: authenticated(async (_, { messageIds, conversationId }, context) => {
    //             return await repository.shareMessages(messageIds, conversationId, context);
    //         }),
    //     };
};

module.exports = MessageResolver;