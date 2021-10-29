const { UserRepository, AuthRepository, AttachmentRepository, AdminRepository } = require("../repository");
const { UserValidator, AuthValidator, AttachmentValidator } = require("../validator");
const AdminResolver = require("./adminResolver");
const AttachmentResolver = require("./attachmentResolver");
const AuthenticationResolver = require("./authenticationResolver");
const UserResolver = require("./userResolver");

const resolvers = [
  new AdminResolver(new AdminRepository()),
  new AttachmentResolver(new AttachmentValidator(), new AttachmentRepository()),
  new AuthenticationResolver(new AuthValidator(), new AuthRepository()),
  new UserResolver(new UserValidator(), new UserRepository()),
];

module.exports = {
  resolvers,
};
