const { authenticated, roleAuthentication } = require("../auth");
const { User, Car, UserCar } = require("../models");

let validator, repository;

class UserResolver {
  constructor(validatorObject, userRepository) {
    validator = validatorObject;
    repository = userRepository;
  };

  Query = {
    thisUser: roleAuthentication(["USER"], async (_, { }, { currentUser }) => await User.findOne({ id: currentUser.id })),
  };

  User = { };

  Mutation = { };
};

module.exports = UserResolver;
