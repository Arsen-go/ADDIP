const { roleAuthentication } = require("../auth");
const { User } = require("../models");

class AdminResolver {
  constructor() { };

  Query = { };

  Mutation = { 
    signInAdmin: async (_, { email, password }) => await repository.signInAdmin(email, password),
  };
};

module.exports = AdminResolver;