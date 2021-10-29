require("dotenv").config();
let validator, repository;

class AuthenticationResolver {
  constructor(validatorObject, authRepository) {
    validator = validatorObject;
    repository = authRepository;
  };

  Mutation = {
    verifyPhone: async (_, { phone }) => {
      await validator.validate(phone);
      await repository.verify(phone);
    },
    
    authenticateUser: async (_, { token, phone }) => {
      await validator.validate(phone);
      return await repository.authenticateUser(token, phone);
    },
  };
};

module.exports = AuthenticationResolver;
