const { uniqid, ApolloError, pubsub } = require("../constants");
const { User, Message, Conversation, MessageLookedDate } = require("../models");
const { Mutex } = require('async-mutex');
const mutex = new Mutex();

class MessageRepository {
    async createMessage(message, conversationId, currentUser) {
        const user = await User.findOne({ id: currentUser.id });
        const conversation = await Conversation.findOne({ id: conversationId });

        let isHavePermissionToWriteMessage = false;
        conversation.users.forEach((u) => {
            if (u.toString() == user._id.toString()) {
                isHavePermissionToWriteMessage = true;
            }
        })
        if (conversation.owner.toString() == user._id.toString()) isHavePermissionToWriteMessage = true;
        if (isHavePermissionToWriteMessage == false) throw new ApolloError("You don't have permission to write message in this conversation.");

        try {
            const dataMessage = new Message({
                message,
                conversation: conversation._id,
                id: `ms_${uniqid()}`,
                createdDate: new Date(),
                owner: user._id,
            });

            const savedMessage = await dataMessage.save();
            pubsub.publish('messageAdded', { messageAdded: savedMessage, conversationId: conversation.id });

            return savedMessage;
        } catch (error) {
            throw new ApolloError(error, 555);
        }
    };

    async onMessageCreateDelete(payload, variables, root) {
        try {
            if (payload.conversationId === variables.conversationId && root && root.currentUser) {
                await this.setLookedConversationMessagesBySimpleParameters(variables.conversationId, root.currentUser.phone);
            }
            return payload.conversationId === variables.conversationId;
        } catch (error) {
            console.log(error);
            return false;
        }
    };

    async setLookedConversationMessagesBySimpleParameters(conversationId, phone) {
        const conversation = await Conversation.findOne({ id: conversationId });
        const user = await User.findOne({ phone });

        const release = await mutex.acquire();
        try {
            await this.setLookedConversationMessages(conversation, user);
        } finally {
            release();
        }
    };


    async setLookedConversationMessages(conversation, user) {
        const messages = await Message.find({ $and: [{ conversation: conversation._id }, { lookedUsers: { $nin: user._id } }] });
        const updatedMessages = [];
        for (let i = 0; i < messages.length; i++) {
            const message = messages[i];
            const lookedUsers = message.lookedUsers;
            const lookedDates = message.lookedDates;
            const allUsers = message.lookedUsers;
            if (!lookedUsers.some(c => c.toString() === user._id.toString())) {
                allUsers.push(user._id);

                // Insert Looked Date
                const lookedDate = await this.insertLookedDate(message, user);
                lookedDates.push(lookedDate._id);

                const messageUpdate = await Message.findOneAndUpdate({ _id: message._id }, { lookedUsers: allUsers, lookedDates: lookedDates }, { upsert: false, new: true });
                updatedMessages.push(messageUpdate);
            }
        }

        if (updatedMessages.length > 0) {
            pubsub.publish('messagesStatusChanged', { messagesStatusChanged: updatedMessages, conversationId: conversation.id });
        }
    };

    async insertLookedDate(message, user) {
        const messageLookedDate = new MessageLookedDate({
            id: `lookDate_${uniqid()}`,
            user: user._id,
            message: message._id,
            createdDate: new Date(),
        });

        const savedMessageLookedDate = await messageLookedDate.save();

        return savedMessageLookedDate;
    };

    async getMessagesByConversationId(currentUser, conversationId, skip, limit) {
        const user = await User.findOne({ id: currentUser.id });
        try {
            const conversation = await Conversation.findOne({ id: conversationId, $or: [{ owner: user._id }, { users: user._id }] });
            if (!conversation) {
                throw "You don't have access to this conversation.";
            }
            return await Message.find({ conversation: conversation._id }).sort({ createdAt: -1 }).skip(skip).limit(limit);
        } catch (error) {
            throw new ApolloError(error);
        };
    };
};

module.exports = MessageRepository;