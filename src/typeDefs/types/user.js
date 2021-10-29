const { gql } = require("apollo-server");

const user = gql `
scalar Date
type User {
    id: String!
    phone: String
    email: String
    firstName: String
    lastName: String
    birthDate: Date
    country: String
    city: String
    role: String
  }
`;

module.exports = {
    user,
};
