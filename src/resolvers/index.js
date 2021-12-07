const { UserRepository, AuthRepository, AttachmentRepository, AdminRepository, QuestionRepository } = require("../repository");
const { UserValidator, AuthValidator, AttachmentValidator, QuestionValidator, AdminValidator } = require("../validator");
const AdminResolver = require("./adminResolver");
const AttachmentResolver = require("./attachmentResolver");
const AuthenticationResolver = require("./authenticationResolver");
const QuestionResolver = require("./questionResolver");
const UserResolver = require("./userResolver");

const resolvers = [
  new AdminResolver(new AdminValidator(), new AdminRepository()),
  new AttachmentResolver(new AttachmentValidator(), new AttachmentRepository()),
  new AuthenticationResolver(new AuthValidator(), new AuthRepository()),
  new QuestionResolver(new QuestionValidator(), new QuestionRepository()),
  new UserResolver(new UserValidator(), new UserRepository(new AuthRepository())),
];

module.exports = {
  resolvers,
};
