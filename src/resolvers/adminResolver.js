const { roleAuthentication } = require("../auth");
const { User } = require("../models");

let validator, repository;

class AdminResolver {
  constructor({ adminValidator, adminRepository }) {
    repository = adminRepository;
    validator = adminValidator;
  };

  Query = {};

  Mutation = {
    signInAdmin: async (_, { email, password }) => {
      await validator.validateSignIn(email, password);
      return await repository.signInAdmin(email, password);
    },
  };
};

module.exports = AdminResolver;