require("dotenv").config();
let validator, repository;

class AuthenticationResolver {
  constructor(validatorObject, authRepository) {
    validator = validatorObject;
    repository = authRepository;
  };

  Mutation = {
    verifyEmail: async (_, { email }) => {
      await validator.validate(email);
      await repository.verifyEmail(email);
    },
    
    authenticateUser: async (_, { code, email }) => {
      return await repository.authenticateUser(code, email);
    },
  };
};

module.exports = AuthenticationResolver;
