const { UserRepository, AuthRepository, AttachmentRepository, AdminRepository, QuestionRepository, ConversationRepository, MessageRepository } = require("../repository");
const { UserValidator, AuthValidator, AttachmentValidator, QuestionValidator, AdminValidator, ConversationValidator, MessageValidator } = require("../validator");
const AdminResolver = require("./adminResolver");
const AttachmentResolver = require("./attachmentResolver");
const AuthenticationResolver = require("./authenticationResolver");
const QuestionResolver = require("./questionResolver");
const UserResolver = require("./userResolver");
const ConversationResolver = require("./conversationResolver");
const MessageResolver = require("./messageResolver");

const resolvers = [
  new AdminResolver(new AdminValidator(), new AdminRepository()),
  new AttachmentResolver(new AttachmentValidator(), new AttachmentRepository()),
  new AuthenticationResolver(new AuthValidator(), new AuthRepository()),
  new QuestionResolver(new QuestionValidator(), new QuestionRepository()),
  new UserResolver(new UserValidator(), new UserRepository(new AuthRepository())),
  new ConversationResolver(new ConversationValidator(), new ConversationRepository()),
  new MessageResolver(new MessageValidator(), new MessageRepository()),
];

module.exports = {
  resolvers,
};
