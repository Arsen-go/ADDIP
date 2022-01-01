const { ApolloError } = require("apollo-server-core");
const { roleAuthentication } = require("../auth");
const { Message } = require("../models");

// const yup = require('yup');
// const { ValidationError, ApolloError, ForbiddenError } = require('apollo-server');
// const { authenticated } = require('../auth');
// const uniqid = require('uniqid');
// const { InviteUtil, MessageUtil, WorkspacePermissionUtil } = require('../middlewares/utils');
// const { Pusher } = require('../middlewares/pusher');
// const { twillio, twillioNumber } = require('../middlewares/twillio')
// const { translate } = require('../middlewares/translator/translate');

// class ConversationResolverUtils {
//     static async makeInviteReturnGuestAndMembers(workspace, phones, ownerphone, isPrivate) {
//         const currentUser = await User.findOne({ phone: ownerphone });
//         const notGuestRoles = await Role.find({ $and: [{ role: { $ne: "GUEST" } }, { workspace: workspace._id }, ] });
//         const notGuestUserIds = notGuestRoles.map(r => r.owner);
//         const notGuestWorkspaceUsers = await User.find({ _id: notGuestUserIds });
//         const workspacesUsers = await User.find({ _id: workspace.users });

//         // Invites not yet assigned
//         const workspaceInvites = await Invite.find({ workspace: workspace._id })
//         const notGuestWorkspaceInvites = workspaceInvites.filter(invite => {
//             return invite.role !== 'GUEST'
//         });
//         const notGuestWorkspaceInvitePhones = notGuestWorkspaceInvites.map(invite => {
//             return invite.phone;
//         });

//         let guestPhones = [];
//         let memberIds = [];
//         for (let pId in phones) {
//             const phone = phones[pId];

//             const isInWorkspace = workspacesUsers.some(u => u.phone === phone)

//             if (notGuestWorkspaceInvitePhones.some(u => u === phone) && !isInWorkspace) {
//                 continue;
//             }

//             if (!notGuestWorkspaceUsers.some(u => u.phone === phone)) {

//                 guestPhones.push(phone);
//             } else {

//                 if (!isPrivate) {
//                     throw new ApolloError(translate(`You can't add member in non private conversation`, `${currentUser.country}`));
//                 }

//                 const user = await User.findOne({ phone });

//                 memberIds.push(user._id);


//             }
//         }


//         // Create Invites
//         for (let pId in phones) {
//             const phone = phones[pId];

//             if (!workspacesUsers.some(u => u.phone === phone)) {
//                 const _ = await InviteUtil.createInvite(workspace.id, "GUEST", phone, ownerphone)
//             }
//         }


//         return { guestPhones, memberIds }

//     }

//     static async createConversationSettings(conversation, user, isReminder, unconfirmed, pastdue, canceled, completed) {
//         const conversationSettingsData = {
//             id: `cnvs${uniqid()}`,
//             conversation: conversation._id,
//             modifyDate: new Date(),
//             isReminder,
//             unconfirmed,
//             pastdue,
//             canceled,
//             completed
//         };

//         const conversationSettings = await ConversationSettings.findOneAndUpdate({
//             $and: [{
//                 conversation: conversation._id
//             }]
//         }, conversationSettingsData, { upsert: true, new: true });

//         return conversationSettings;

//     }

//     static async sendPushToMembers(phones, conversation) {
//         console.log(phones);
//         for (let i = 0; i < phones.length; i++) {
//             let phone = phones[i];
//             const user = await User.findOne({ phone });

//             if (user) {
//                 const conversationPush = { conversationId: conversation.id }
//                 await Pusher.sendGroupInviteNotification(user, user.sound, conversationPush, conversation);
//             } else {
//                 // Send SMS
//                 twillio.messages.create({
//                     body: 'You have been invited in Motivity. Please follow to this link https://api.motivity.app/static/?id=' + conversation.workspace,
//                     to: phone,
//                     from: twillioNumber
//                 }).then((success) => {

//                 }).catch((error) => {
//                     throw new ApolloError(error);
//                 })
//             }

//         }


//     }

//     static async deleteWorkspaceIfOneConversation(_userId, _conversationId) {
//         const convs = await Conversation.find({
//             $and: [{
//                     _id: _conversationId
//                 },
//                 { users: _userId }
//             ]
//         });
//         if (convs.length == 1) {
//             const conversation = convs[0];
//             const role = await Role.findOne({ $and: [{ workspace: conversation.workspace }, { owner: _userId }] });

//             if (role && role.role === 'GUEST') {
//                 await Role.deleteOne({ _id: role._id });

//                 /// Delete workspace user
//                 const workspace = await Workspace.findOne({ _id: conversation.workspace });
//                 if (workspace) {
//                     const removedUsers = workspace.users.flatMap((u) => {
//                         if (u.toString() === _userId.toString()) {
//                             return []
//                         } else {
//                             return [u]
//                         }
//                     });
//                     await Workspace.findOneAndUpdate({ _id: conversation.workspace }, { users: removedUsers }, { upsert: false, new: true });
//                 }

//             }


//         }
//     }

//     static async createMembers(members, conversation) {
//         await ConversationRole.deleteMany({ conversation: conversation._id });

//         for (let i = 0; i < members.length; i++) {
//             const member = members[i];
//             await ConversationResolverUtils.createMember(member, conversation);
//         }
//     }

//     static async createMember(member, conversation) {
//         const conversationRole = new ConversationRole({
//             id: `cvr${uniqid()}`,
//             role: 'ADMIN',
//             createdDate: new Date(),
//             owner: member._id,
//             conversation: conversation._id
//         });

//         try {
//             await conversationRole.save();
//         } catch (error) {
//             throw new ApolloError(error)
//         }
//     }
// }

let validator, repository;

class ConversationResolver {
    constructor(conversationValidator, conversationRepository) {
        validator = conversationValidator;
        repository = conversationRepository;
    };

    Query = {
        getConversations: roleAuthentication(["USER"], async (_, { }, { currentUser }) => {
            return await repository.getMyConversations(currentUser);
        }),
        //     conversationSettings: authenticated(async(root, { conversationId }, { currentUser }) => {
        //         const conversation = await Conversation.findOne({ id: conversationId });
        //         if (!conversation) {
        //             throw new ForbiddenError(translate('This group no longer exists.', `${currentUser.country}`));
        //         }

        //         const conversationSettings = await ConversationSettings.findOne({
        //             $and: [{
        //                 conversation: conversation._id
        //             }]
        //         });

        //         if (!conversationSettings) {
        //             return await ConversationResolverUtils.createConversationSettings(conversation, currentUser, true, 86400, 86400, true, true);
        //         }

        //         return conversationSettings;
        //     }),

        conversationById: roleAuthentication(["USER"], async (_, { conversationId }) => {
            return await repository.getConversationById(conversationId);
        }),

        //     individualPermissions: authenticated(async(root, { conversationId }, { currentUser }) => {
        //         const conversation = await Conversation.findOne({ id: conversationId });
        //         try {
        //             return await ConversationIndividualPermission.find({ conversation: conversation._id, user: currentUser._id })
        //         } catch (error) {
        //             throw new ApolloError(error.message);
        //         }
        //     })


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

    // ConversationSettings = {
    //     conversation: async(conversationSettings) => {
    //         const conversation = await Conversation.findOne({ _id: conversationSettings.conversation });

    //         return conversation;
    //     },


    // };

    // Conversation = {
    //     async admins(conversation) {
    //         try {
    //             const roles = await ConversationRole.find({ conversation: conversation._id })
    //             const users = roles.map(function(role) { return role.owner; });
    //             return await User.find({ _id: users });
    //             ß
    //         } catch (error) {
    //             throw new ApolloError(error.message);
    //         }
    //     },
    //     async owner(conversation) {
    //         try {
    //             return await User.findOne({ _id: conversation.owner })
    //         } catch (error) {
    //             throw new ApolloError(error.message);
    //         }
    //     },
    //     async project(conversation) {
    //         try {
    //             return await Project.findOne({ _id: conversation.project })
    //         } catch (error) {
    //             throw new ApolloError(error.message);
    //         }
    //     },

    //     async invites(conversation) {
    //         try {
    //             const conversationInvites = await ConversationInvite.find({ conversation: conversation._id });

    //             return conversationInvites;
    //         } catch (error) {
    //             throw new ApolloError(error.message);
    //         }
    //     },

    //     async users(conversation) {
    //         try {
    //             return await User.find({ _id: conversation.users })
    //         } catch (error) {
    //             throw new ApolloError(error.message);
    //         }
    //     },

    //     async workspace(conversation) {
    //         try {
    //             const workspace = await Workspace.findOne({ _id: conversation.workspace })
    //             return workspace;
    //         } catch (error) {
    //             throw new ApolloError(error.message);
    //         }
    //     },
    //     async attachment(conversation) {
    //         try {
    //             return await Attachment.findOne({ _id: conversation.attachment })
    //         } catch (error) {
    //             throw new ApolloError(error.message);
    //         }
    //     },
    //     async lastUpdatedDate(conversation) {
    //         try {
    //             const lastMessage = await Message.findOne({ conversation: conversation._id }).sort('-createdDate');
    //             if (lastMessage) {
    //                 return lastMessage.createdDate
    //             } else {
    //                 return conversation.createdDate;
    //             }
    //         } catch (error) {
    //             throw new ApolloError(error.message);
    //         }
    //     }


    // };

    // ConversationIndividiualPermission = {
    //     async conversation(conversationIndividualPermission) {
    //         try {
    //             return await Conversation.findOne({ _id: conversationIndividualPermission.conversation })
    //         } catch (error) {
    //             throw new ApolloError(error.message);
    //         }
    //     },
    // };

    Mutation = {

        // setConversationPublic: authenticated(async(root, { conversationId }, { currentUser }) => {

        //     const conversation = await Conversation.findOne({ $and: [{ id: conversationId }, { owner: currentUser._id }] });

        //     if (!conversation) {
        //         throw new ForbiddenError(translate('This group no longer exists', `${currentUser.country}`));
        //     }

        //     try {
        //         // Push notification to all private users
        //         const users = await User.find({ _id: conversation.users });
        //         for (let i = 0; i < users.length; i++) {
        //             let user = users[i];
        //             await Pusher.sendPrivateToPublicNotification(user, { id: conversation.id }, conversation)
        //         }

        //         const savedConversation = await Conversation.findOneAndUpdate({ id: conversationId }, { isPrivate: false }, { upsert: false, new: true });

        //         return savedConversation;
        //     } catch (error) {
        //         throw new ApolloError(error)
        //     }
        // }),

        // updateConversation: authenticated(async(root, { title, desc, conversationId }, { currentUser }) => {
        //     // Validation
        //     const schema = yup.object().shape({
        //         title: yup.string().required(),
        //         desc: yup.string().required(),
        //     });

        //     try {
        //         await schema.strict().validate({ title, desc })
        //     } catch (error) {
        //         throw new ValidationError(error.message);
        //     }

        //     const conversation = await Conversation.findOne({ $and: [{ id: conversationId }, { owner: currentUser._id }] });

        //     if (!conversation) {
        //         throw new ForbiddenError(translate('This group no longer exists', `${currentUser.country}`));
        //     }

        //     try {
        //         const savedConversation = await Conversation.findOneAndUpdate({ id: conversationId }, { title: title, desc: desc }, { upsert: false, new: true });

        //         return savedConversation;
        //     } catch (error) {
        //         throw new ApolloError(error)
        //     }
        // }),

        // deleteConversationMembers: authenticated(async(root, { memberIds, conversationId }, context) => {
        //     const conversationAccess = await Conversation.findOne({ id: conversationId })
        //     if (!conversationAccess) {
        //         throw new ForbiddenError(translate('This group no longer exists.', `${context.country()}`));
        //     }

        //     /// TODO Security
        //     // const adminRoles = await ConversationRole.find({ conversation: conversationAccess._id })
        //     // let admins = adminRoles.map(function (role) { return role.owner._id });
        //     // admins.push(user._id);

        //     // const conversation = await Conversation.findOne({
        //     //   $and: [
        //     //     { id: conversationId },
        //     //     { owner: user._id }]
        //     // });
        //     // if (!conversation) {
        //     //   throw new ForbiddenError("Conversation not exist or you don't have permission");
        //     // }

        //     const members = await User.find({ id: memberIds });
        //     const realMembers = conversationAccess.users;
        //     let changedMembers = [];

        //     for (let i = 0; i < realMembers.length; i++) {
        //         const member = realMembers[i];
        //         if (members.some(m => m._id.toString() === member._id.toString())) {
        //             /// Delete workspace if only one conversation
        //             await ConversationResolverUtils.deleteWorkspaceIfOneConversation(member._id, conversationAccess._id);
        //             continue;
        //         }
        //         changedMembers.push(member);
        //     }

        //     const savedConversation = await Conversation.findOneAndUpdate({ id: conversationAccess.id }, { users: changedMembers }, { upsert: false, new: true });

        //     return savedConversation;
        // }),

        // setAdminMembers: authenticated(async(root, { memberIds, conversationId }, { currentUser }) => {
        //     const conversation = await Conversation.findOne({
        //         $and: [
        //             { id: conversationId },
        //             { owner: currentUser._id }
        //         ]
        //     });
        //     if (!conversation) {
        //         throw new ForbiddenError("Conversation not exist or you don't have permission");
        //     }

        //     const members = await User.find({ id: memberIds });

        //     await ConversationResolverUtils.createMembers(members, conversation);
        //     return conversation;
        // }),

        // addConversationUsers: authenticated(async(root, { conversationId, phones }, context) => {
        //     // Validation
        //     const schema = yup.object().shape({
        //         conversationId: yup.string().required(),
        //         phones: yup.array().of(yup.string().required()).min(1).required(),
        //     });

        //     try {
        //         await schema.strict().validate({ conversationId, phones })
        //     } catch (error) {
        //         throw new ValidationError(error.message);
        //     }

        //     const user = context.currentUser;
        //     const conversation = await Conversation.findOne({ id: conversationId });
        //     if (!conversation) {
        //         throw new ForbiddenError("Workspace not exist or you don't have permission");
        //     }

        //     const workspace = await Workspace.findOne({ _id: conversation.workspace });

        //     const role = await Role.findOne({ $and: [{ workspace: workspace._id }, { owner: user._id }] });
        //     if (role && role.role === 'GUEST') {
        //         throw new ForbiddenError("You don't have permission to make conversations on this workspace");
        //     }

        //     let { guestPhones, memberIds } = await ConversationResolverUtils.makeInviteReturnGuestAndMembers(workspace, phones, context.currentUser.phone, conversation.isPrivate)

        //     // Push notification to exist members
        //     ConversationResolverUtils.sendPushToMembers(phones, conversation);

        //     // Add self user id
        //     memberIds.push(user._id);

        //     // Merge conversationMembers
        //     const conversationMembers = await User.find({ _id: conversation.users });
        //     if (conversationMembers) {
        //         conversationMembers.forEach(member => {
        //             if (!memberIds.some(m => m === member._id)) {
        //                 memberIds.push(member);
        //             }
        //         });
        //     }

        //     try {
        //         const savedConversation = await Conversation.findOneAndUpdate({ id: conversationId }, { users: memberIds }, { upsert: false, new: true });

        //         for (let i = 0; i < guestPhones.length; i = i + 1) {
        //             let p = guestPhones[i];
        //             await InviteUtil.createConversationInvite(savedConversation.id, "GUEST", p, context.currentUser.phone);
        //         }

        //         let invitedPhones = [];
        //         for (let i = 0; i < phones.length; i = i + 1) {
        //             let p = phones[i];

        //             if (invitedPhones.some(u => u === p)) {
        //                 continue;
        //             }

        //             const messageText = translate(`...has been invited to the group`, `${user.country}`, { p: p});
        //             await MessageUtil.createMessage(messageText, savedConversation._id, user._id, undefined, undefined, undefined, "INVITED_MESSAGE");

        //             invitedPhones.push(p);
        //         }


        //         return savedConversation;
        //     } catch (error) {
        //         throw new ApolloError(error)
        //     }


        // }),

        createConversation: roleAuthentication(["USER"], async (_, { title, desc, userId }, { currentUser }) => {
            await validator.validateConversation(title, desc, userId);
            return await repository.createConversation(currentUser, title, desc, userId);
        }),

        // rejectConversationInvite: authenticated(async(root, { inviteId }, context) => {
        //     // Validation
        //     const schema = yup.object().shape({
        //         inviteId: yup.string().required(),
        //     });

        //     try {
        //         await schema.strict().validate({ inviteId })
        //     } catch (error) {
        //         throw new ValidationError(error.message);
        //     }

        //     const savedInvite = await ConversationInvite.findOne({ id: inviteId });
        //     if (!savedInvite) {
        //         throw new ApolloError("Invite not exist");
        //     }
        //     if (savedInvite.phone !== context.currentUser.phone) {
        //         throw new ForbiddenError("This invite not for you");
        //     } else {
        //         try {
        //             await savedInvite.remove();
        //         } catch (error) {
        //             throw new ApolloError(error);
        //         }
        //     }

        // }),

        // assignConversationInvite: authenticated(async(root, { inviteId }, context) => {
        //     console.log("start assign for " + inviteId)
        //         // Validation
        //     const schema = yup.object().shape({
        //         inviteId: yup.string().required(),
        //     });

        //     try {
        //         await schema.strict().validate({ inviteId })
        //     } catch (error) {
        //         throw new ValidationError(error.message);
        //     }

        //     const savedInvite = await ConversationInvite.findOne({ id: inviteId }).populate({
        //         path: 'conversation',
        //         model: Conversation,
        //         select: '_id',
        //         populate: {
        //             path: 'workspace',
        //             model: Workspace,
        //             select: '_id, users'
        //         }
        //     });
        //     if (!savedInvite) {
        //         throw new ApolloError("Invite not exist");
        //     }
        //     if (savedInvite.phone !== context.currentUser.phone) {
        //         throw new ForbiddenError("This invite not for you");
        //     } else {
        //         try {
        //             const savedConversation = await Conversation.findOne({ _id: savedInvite.conversation });
        //             let users = savedConversation.users;
        //             const phone = context.currentUser.phone;
        //             const currentUser = await User.findOne({ phone })
        //             const workspaceUsers = await User.find({ _id: users })

        //             if (users.length > 0) {
        //                 if (!workspaceUsers.some(u => u.phone === phone)) {
        //                     users.push(currentUser._id);
        //                 }
        //             } else {
        //                 users = [currentUser._id];
        //             }

        //             const fromUser = await User.findOne({ phone: savedInvite.ownerPhone });

        //             console.log(" send push to " + savedInvite.ownerPhone)

        //             if (fromUser) {
        //                 const isEnabled = savedConversation.isIndividual ? !fromUser.disableMessageNotification : !fromUser.disableGroupNotification;
        //                 let sound = savedConversation.isIndividual ? fromUser.sound : fromUser.soundGroup;

        //                 console.log(" start send push to " + savedInvite.ownerPhone)

        //                 if (isEnabled) {
        //                     await Pusher.sendAssignNotification(fromUser, currentUser, sound, {}, savedConversation.title)
        //                 }
        //             }
        //             const user = await User.findOne({ phone: savedInvite.phone });
        //             if(!savedInvite.conversation.workspace.users.includes(user._id)) {
        //                 savedInvite.conversation.workspace.users.push(user._id);
        //                 await savedInvite.conversation.workspace.save();
        //             }
        //             await Invite.deleteOne({ workspace: savedInvite.conversation.workspace._id, phone: savedInvite.phone, ownerPhone: savedInvite.ownerPhone });
        //             await Conversation.updateOne({ _id: savedConversation._id }, { $set: { users } })
        //             await savedInvite.remove();
        //         } catch (error) {
        //             throw new ApolloError(error);
        //         }
        //     }
        // }),

        // removeConversationInvite:  authenticated(async(root, { inviteId }, context) => {
        //     await validator.validateInvite(inviteId);
        //     const removedInvite = await repository.removeConversationInvite(inviteId, context);
        //     return await Conversation.findOne({ _id: removedInvite.conversation }); 
        // }),

        // setConversationAttachment: authenticated(async(root, { attachmentId, conversationId }, context) => {
        //     // Validation
        //     const schema = yup.object().shape({
        //         attachmentId: yup.string().required(),
        //         conversationId: yup.string().required(),
        //     });

        //     try {
        //         await schema.strict().validate({ attachmentId, conversationId })
        //     } catch (error) {
        //         throw new ValidationError(error.message);
        //     }

        //     try {
        //         const attachment = await Attachment.findOne({ id: attachmentId });
        //         const savedWorkspace = await Conversation.findOneAndUpdate({ id: conversationId }, { attachment: attachment._id }, { upsert: false, new: true });

        //         return savedWorkspace;
        //     } catch (error) {
        //         throw new ApolloError(error)
        //     }
        // }),

        // exitConversation: authenticated(async(root, { conversationId }, context) => {
        //     // Validation
        //     const schema = yup.object().shape({
        //         conversationId: yup.string().required(),
        //     });

        //     try {
        //         await schema.strict().validate({ conversationId })
        //     } catch (error) {
        //         throw new ValidationError(error.message);
        //     }

        //     const user = context.currentUser;
        //     const conversation = await Conversation.findOne({ id: conversationId });

        //     if (!conversation) {
        //         throw new ForbiddenError(translate('This group no longer exists.', `${user.country}`));
        //     }

        //     const conversationUsers = await User.find({ _id: conversation.users });
        //     let existUser;
        //     for (let i = 0; i < conversationUsers.length; i++) {
        //         const conversationUser = conversationUsers[i];
        //         if (user.id === conversationUser.id) {
        //             existUser = conversationUser;
        //         }
        //     }

        //     if (!existUser) {
        //         throw new ForbiddenError("Your user not exist in conversation users");
        //     }

        //     const allUserExceptCurrentUser = conversationUsers.flatMap(u => {
        //         if (u.id === existUser.id) {
        //             return [];
        //         } else {
        //             return [u._id];
        //         }
        //     })

        //     if(allUserExceptCurrentUser.length === 1 && conversation.isIndividual) {
        //         await repository.deleteConversation([conversation.id], context.currentUser.phone);
        //     }

        //     try {
        //         const savedConversation = await Conversation.findOneAndUpdate({ id: conversation.id }, { users: allUserExceptCurrentUser }, { upsert: false, new: true });
        //         return savedConversation;
        //     } catch (error) {
        //         throw new ApolloError(error)
        //     }
        // }),

        // deleteConversation: authenticated(async(root, { conversationIds }, context) => {
        //     await validator.validateConversationId(conversationIds);
        //     await repository.deleteConversation(conversationIds, context.currentUser.phone);
        //     return '';
        // }),


        // updateConversationIndividualPermission: authenticated(async(root, { conversationId, type, value, expirationInterval }, context) => {
        //     // Validation
        //     const schema = yup.object().shape({
        //         conversationId: yup.string().required(),
        //         type: yup.string().required().oneOf(["MUTE", null]),
        //         value: yup.number().required(),
        //     });

        //     try {
        //         await schema.strict().validate({ conversationId, type, value })
        //     } catch (error) {
        //         throw new ValidationError(error.message);
        //     };
        //     const phone = context.currentUser.phone;
        //     const user = await User.findOne({ phone });
        //     const conversation = await Conversation.findOne({ id: conversationId });
        //     if (!conversation) {
        //         throw new ForbiddenError(translate('This group no longer exists.', `${user.country}`));
        //     }

        //     try {
        //         const currentPermission = await ConversationIndividualPermission.findOne({ conversation: conversation._id, user: user._id });
        //         let id = `wiss${uniqid()}`;
        //         if (currentPermission && currentPermission.id) {
        //             id = currentPermission.id;
        //         }
        //         const modifyDate = new Date();

        //         let expirationDate = null;
        //         if (expirationInterval) {
        //             expirationDate = new Date();
        //             expirationDate.setSeconds(expirationDate.getSeconds() + expirationInterval);
        //         }

        //         const workspacePermissionUpdates = {
        //             id: id,
        //             conversation: conversation._id,
        //             user: user._id,
        //             modifyDate,
        //             type,
        //             value,
        //             expirationDate
        //         };

        //         const newPemission = await ConversationIndividualPermission.findOneAndUpdate({ id }, workspacePermissionUpdates, { upsert: true, new: true });

        //         return newPemission;

        //     } catch (error) {
        //         throw new ApolloError(error)
        //     }
        // }),
    };
};


module.exports = ConversationResolver;