const { authenticated, roleAuthentication } = require("../auth");
const { User } = require("../models");

let validator, repository;

class UserResolver {
  constructor(validatorObject, userRepository) {
    validator = validatorObject;
    repository = userRepository;
  };

  Query = {
    deleteMe: roleAuthentication(["USER"], async (_, { }, { currentUser }) => await repository.deleteMe(currentUser)),

    thisUser: roleAuthentication(["USER"], async (_, { }, { currentUser }) => await User.findOne({ id: currentUser.id })),

    getUsers: roleAuthentication(["USER", "ADMIN"], async (_, { limit, skip }) => await repository.getUsers(limit, skip)),
  };

  User = {};

  Mutation = {
    createUserProfile: roleAuthentication(["USER"], async (_, { firstName, lastName, birthDate, password }, { currentUser }) => {
      await validator.validateCreateUserProfile(firstName, lastName, birthDate, password);
      return await repository.createUserProfile(currentUser, firstName, lastName, birthDate, password);
    }),

    signInUser: async (_, { email, password }) => {
      await validator.validateUserLogin(email, password);
      return await repository.signInUser(email, password);
    },
  };
};

module.exports = UserResolver;
