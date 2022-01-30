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
    createUserProfile: roleAuthentication(["USER"], async (_, { firstName, lastName, birthDate, password, faculty, course }, { currentUser }) => {
      await validator.validateCreateUserProfile(firstName, lastName, birthDate, password, faculty, course);
      return await repository.createUserProfile(currentUser, firstName, lastName, birthDate, password, faculty, course);
    }),

    editUserProfile: roleAuthentication(["USER"], async (_, { firstName, lastName, birthDate, password, faculty, course }, { currentUser }) => {
      await validator.validateEditDetails(firstName, lastName, birthDate, password, faculty, course);
      return await repository.editUserProfile(currentUser, firstName, lastName, birthDate, password, faculty, course);
    }),

    signInUser: async (_, { email, password }) => {
      await validator.validateUserLogin(email, password);
      return await repository.signInUser(email, password);
    },
  };
};

module.exports = UserResolver;
