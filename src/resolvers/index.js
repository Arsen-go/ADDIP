const { UserRepository, AuthRepository, AttachmentRepository, AdminRepository, QuestionRepository, ConversationRepository, PollRepository, MessageRepository } = require("../repository");
const { UserValidator, AuthValidator, PollValidator, AttachmentValidator, QuestionValidator, AdminValidator, ConversationValidator, MessageValidator } = require("../validator");
const AdminResolver = require("./adminResolver");
const AttachmentResolver = require("./attachmentResolver");
const AuthenticationResolver = require("./authenticationResolver");
const QuestionResolver = require("./questionResolver");
const UserResolver = require("./userResolver");
const ConversationResolver = require("./conversationResolver");
const MessageResolver = require("./messageResolver");
const PollResolver = require("./pollResolver");

class ClassFactory {
  constructor() {
    this.authRepository = new AuthRepository();
    this.questionRepository = new QuestionRepository();
    this.conversationRepository = new ConversationRepository();
    this.pollRepository = new PollRepository();
    this.userRepository = new UserRepository();
    this.attachmentRepository = new AttachmentRepository();
    this.adminRepository = new AdminRepository();
    this.messageRepository = new MessageRepository();
  }

  createResolver(resolver, ...params) {
    let objects = {};
    params.forEach((p) => {
      switch (p) {
        case "AdminRepository":
          objects.adminRepository = new AdminRepository();
          break;
        case "AuthRepository":
          objects.authRepository = new AuthRepository();
          break;
        case "QuestionRepository":
          objects.questionRepository = new QuestionRepository();
          break;
        case "ConversationRepository":
          objects.conversationRepository = new ConversationRepository();
          break;
        case "PollRepository":
          objects.pollRepository = new PollRepository();
          break;
        case "UserRepository":
          objects.userRepository = new UserRepository();
          break;
        case "AttachmentRepository":
          objects.attachmentRepository = new AttachmentRepository();
          break;
        case "MessageRepository":
          objects.messageRepository = new MessageRepository();
          break;
        case "AdminValidator":
          objects.adminValidator = new AdminValidator();
          break;
        case "UserValidator":
          objects.userValidator = new UserValidator();
          break;
        case "AuthValidator":
          objects.authValidator = new AuthValidator();
          break;
        case "PollValidator":
          objects.pollValidator = new PollValidator();
          break;
        case "AttachmentValidator":
          objects.attachmentValidator = new AttachmentValidator();
          break;
        case "QuestionValidator":
          objects.questionValidator = new QuestionValidator();
          break;
        case "ConversationValidator":
          objects.conversationValidator = new ConversationValidator();
          break;
        case "MessageValidator":
          objects.messageValidator = new MessageValidator();
          break;
        default:
          break;
      }
    })
    switch (resolver) {
      case "AdminResolver":
        return new AdminResolver(objects);
      case "UserResolver":
        return new UserResolver(objects);
      case "AttachmentResolver":
        return new AttachmentResolver(objects);
      case "AuthenticationResolver":
        return new AuthenticationResolver(objects);
      case "QuestionResolver":
        return new QuestionResolver(objects);
      case "ConversationResolver":
        return new ConversationResolver(objects);
      case "MessageResolver":
        return new MessageResolver(objects);
      case "PollResolver":
        return new PollResolver(objects);
      default:
        console.log("Error on creating resolver: No any resolver selected!");
        break;
    }
  };

  createRepository(repository, ...params) {
    let objects = {};
    params.forEach((p) => {
      switch (p) {
        case "AdminRepository":
          objects.adminRepository = new AdminRepository();
          break;
        case "AuthRepository":
          objects.authRepository = new AuthRepository();
          break;
        case "QuestionRepository":
          objects.questionRepository = new QuestionRepository();
          break;
        case "ConversationRepository":
          objects.conversationRepository = new ConversationRepository();
          break;
        case "PollRepository":
          objects.pollRepository = new PollRepository();
          break;
        case "UserRepository":
          objects.userRepository = new UserRepository();
          break;
        case "AttachmentRepository":
          objects.attachmentRepository = new AttachmentRepository();
          break;
        case "MessageRepository":
          objects.messageRepository = new MessageRepository();
          break;
        default:
          break;
      }
    })
    switch (repository) {
      case "AdminRepository":
        return new AdminRepository(objects);
      case "UserRepository":
        return new UserRepository(objects);
      case "AttachmentRepository":
        return new AttachmentRepository(objects);
      case "AuthRepository":
        return new AuthRepository(objects);
      case "QuestionRepository":
        return new QuestionRepository(objects);
      case "ConversationRepository":
        return new ConversationRepository(objects);
      case "MessageRepository":
        return new MessageRepository(objects);
      case "PollRepository":
        return new PollRepository(objects);
      default:
        console.log("Error on creating resolver: No any resolver selected!");
        break;
    }
  }
}

const classFactory = new ClassFactory();

const resolvers = [
  classFactory.createResolver("AdminResolver", "AdminRepository", "AdminValidator"),
  classFactory.createResolver("AttachmentResolver", "AttachmentRepository", "AttachmentValidator"),
  classFactory.createResolver("AuthenticationResolver", "AuthRepository", "AuthValidator"),
  classFactory.createResolver("QuestionResolver", "QuestionRepository", "QuestionValidator"),
  new UserResolver(new UserValidator(), new UserRepository(classFactory.authRepository, classFactory.questionRepository, classFactory.conversationRepository)),
  classFactory.createResolver("ConversationResolver", "ConversationRepository", "ConversationValidator"),
  classFactory.createResolver("MessageResolver", "MessageRepository", "MessageValidator"),
  classFactory.createResolver("PollResolver", "", "PollValidator"),
];

module.exports = {
  resolvers,
};
