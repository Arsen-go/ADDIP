const { ApolloError } = require("../constants");

const authenticated = (next) => async (root, args, context, info) => {
  const { currentUser, currentAdmin } = context;
  if (!currentUser && !currentAdmin) {
    throw new ApolloError("Unauthenticated!");
  }

  return next(root, args, context, info);
};

const roleAuthentication = (roles, next) => (root, args, context, info) => {
  const { currentUser, currentAdmin } = context;
  if (!currentUser && !currentAdmin) {
    throw new Error("Unauthenticated!");
  }

  if (!roles) {
    return next(root, args, context, info);
  }

  let role;
  if (currentUser) {
    role = currentUser.role;
  }

  if (currentAdmin) {
    role = currentAdmin.role;
  }
  if (roles.includes(role)) {
    return next(root, args, context, info);
  } else {
    throw new Error(`${info.fieldName} is not accessible for this user.`);
  }
};

module.exports = { authenticated, roleAuthentication };
