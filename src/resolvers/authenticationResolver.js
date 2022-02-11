require("dotenv").config();
let validator, repository;

class AuthenticationResolver {
  constructor({ authValidator, authRepository }) {
    validator = authValidator;
    repository = authRepository;
  };

  Mutation = {
    verifyEmail: async (_, { email, isVisitor }) => {
      await validator.validate(email);
      await repository.verifyEmail(email, isVisitor);
    },

    authenticateUser: async (_, { code, email }) => {
      return await repository.authenticateUser(code, email);
    },
  };
};

module.exports = AuthenticationResolver;
