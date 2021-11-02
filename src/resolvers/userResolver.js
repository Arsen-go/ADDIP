const { authenticated, roleAuthentication } = require("../auth");
const { User } = require("../models");

let validator, repository;

class UserResolver {
  constructor(validatorObject, userRepository) {
    validator = validatorObject;
    repository = userRepository;
  };

  Query = {
    thisUser: roleAuthentication(["USER"], async (_, { }, { currentUser }) => await User.findOne({ id: currentUser.id })),
  };

  User = {};

  Mutation = {
    createUserProfile: roleAuthentication(["USER"], async (_, { firstName, lastName, birthDate, gender }, { currentUser }) => {
      await validator.validateCreateUserProfile(firstName, lastName, birthDate, gender);
      return await repository.createUserProfile(currentUser, firstName, lastName, birthDate, gender);
    }),
  };
};

module.exports = UserResolver;
