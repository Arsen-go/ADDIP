const { User, Conversation } = require("../models");
const { uniqid, ApolloError } = require("../constants");

class ConversationRepository {
    async createConversation(currentUser, title, desc, userId) {
        const user = await User.findOne({ id: currentUser.id });
        let memberIds = [];

        if (userId) {
            const member = await User.findOne({ id: userId });
            memberIds.push(member._id);
        }

        const conversation = new Conversation({
            id: `conv_${uniqid()}`,
            title,
            desc,
            createdDate: new Date(),
            users: memberIds,
            owner: user._id,
            isPrivate: false,
            isIndividual: false
        });

        try {
            const savedConversation = await conversation.save();

            return savedConversation;
        } catch (error) {
            throw new ApolloError(error)
        }
    };

    async getMyConversations(currentUser) {
        const user = await User.findOne({ id: currentUser.id });
        const myConversations = await Conversation.find({ $or: [{ owner: user._id }, { users: user._id }] });
        return myConversations;
    };

    async getConversationById(conversationId) {
        try {
            const conversation = await Conversation.findOne({ id: conversationId });
            return conversation;
        } catch (error) {
            throw new ApolloError(error);
        }
    };

    //     async removeConversationInvite(inviteId) {
    //         const invite = await ConversationInvite.findOne({ id: inviteId }).populate("conversation");
    //         if (!invite) {
    //             throw new ApolloError("Invite not exist");
    //         }
    //         const user = await User.findOne({ phone: invite.phone });
    //         if (user) {
    //             await this._removeInvite(invite, user);
    //             await Conversation.findOneAndUpdate({ _id: invite.conversation }, { $pull: { users: { $in: [user._id] } } });
    //         }
    //         return await invite.remove();
    //     };

    //     async deleteConversation(conversationIds, phone) {
    //         const deleteOneConversations = async (conversationId) => {
    //             const user = await User.findOne({ phone });
    //             const conversation = await Conversation.findOne({ id: conversationId });
    //             if (!conversation) {
    //                 throw new ApolloError(translate('This group no longer exists.',`${user.country}`));
    //             }
    //             const role = await Role.findOne({ $and: [{ workspace: conversation.workspace }, { owner: user._id }] });
    //             if (!(conversation.owner.toString() === user._id.toString() || role.role === 'ADMIN')) {
    //                 throw new ForbiddenError("Conversation not exist or you have no permission to delete this conversation")

    //             }

    //             await this._deleteConversation(conversation.id);
    //         }
    //         await from(conversationIds).pipe(map(async (id) => await deleteOneConversations(id))).toPromise();
    //     };

    //     async _deleteConversation(conversationId) {
    //         const conversation = await Conversation.findOne({ id: conversationId });
    //         const invitesAllUser = await ConversationInvite.find({ conversation: conversation._id }).populate("conversation");
    //         try {
    //             if (invitesAllUser) {
    //                 await this._deleteConversationInvites(invitesAllUser, conversation);
    //             }
    //             await this._deleteUsersInWorkspace(conversation);
    //             await this._deleteRelatingThings(conversation);
    //         } catch (error) {
    //             throw new ApolloError(error)
    //         }
    //     };

    //     async _deleteUsersInWorkspace(conversation) {
    //         await from(conversation.users).pipe(map(async (id) => await this._deleteUserInWorkspace(id, conversation))).toPromise();
    //     };

    //     async _deleteUserInWorkspace(userId, conversation) {
    //         const conversationUser = await User.findOne({ _id: userId });
    //         const isOwner = await Conversation.findOne({ owner: conversationUser._id });
    //         if (isOwner) {
    //             return;
    //         }
    //         const anotherConversations = await Conversation.find({ id: { $ne: conversation.id }, users: { $in: [userId] } });
    //         const conversationInvites = await ConversationInvite.find({ phone: conversationUser.phone });
    //         const haveAnotherInviteInThisWorkspace = await from(conversationInvites).pipe(map(async invite => await this._isInOneWorkspace(invite))).toPromise();
    //         if (!anotherConversations.length && !haveAnotherInviteInThisWorkspace) {
    //             await Workspace.findOneAndUpdate({ _id: conversation.workspace, owner: { $ne: userId } }, { $pull: { users: { $in: [userId] } } });
    //         }
    //     };

    //     async _deleteConversationInvites(invitesAllUser, conversation) {
    //         await from(invitesAllUser).pipe(map(async (invite) => {
    //             const user = await User.findOne({ phone: invite.phone });
    //             if (!user) {
    //                 return
    //             }
    //             const anotherConversationsInOneWorkspace = await Conversation.find({ users: { $in: [user._id] }, workspace: conversation.workspace });

    //             if (anotherConversationsInOneWorkspace.length == 0) {
    //                 await Workspace.findOneAndUpdate({ _id: invite.conversation.workspace }, { $pull: { users: { $in: [user._id] } } });
    //             }
    //             await this._removeInvite(invite, user);
    //         })).toPromise();
    //     };

    //     async _removeInvite(invite, user) {
    //         if (await this._isInOneWorkspace(invite)) {
    //             await Workspace.findOneAndUpdate({ _id: invite.conversation.workspace }, { $pull: { users: { $in: [user._id] } } });
    //             await Invite.findOneAndDelete({ phone: invite.phone, ownerPhone: invite.ownerPhone, workspace: invite.conversation.workspace });
    //         }
    //     };

    //     async _isInOneWorkspace(invite) {
    //         const invitesInDifferentConversation = await ConversationInvite.find({ $and: [{ phone: invite.phone, ownerPhone: invite.ownerPhone }] }).populate("conversation", "workspace");
    //         let arr = new Set([]);
    //         if (invitesInDifferentConversation.length > 1) {
    //             arr = new Set(invitesInDifferentConversation.map((i) => i.conversation.workspace.toString()));
    //         }
    //         return (invitesInDifferentConversation.length == arr.size || invitesInDifferentConversation.length == 1);
    //     };

    //     async _deleteRelatingThings(conversation) {
    //         await ConversationRole.deleteMany({ conversation: conversation._id });
    //         await Task.deleteMany({ conversation: conversation._id });
    //         await ConversationInvite.deleteMany({ conversation: conversation._id })
    //         await Conversation.deleteOne({ _id: conversation._id });
    //         await Message.deleteMany({ conversation: conversation._id });
    //         await DeletedMessage.deleteMany({ conversation: conversation._id });
    //     };
};

module.exports = ConversationRepository;