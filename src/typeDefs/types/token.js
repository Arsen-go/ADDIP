const { gql } = require("apollo-server");

const token = gql`
type Token {
  authToken: String!
  tokenExpiresAfter: Int!
  refreshToken: String
  refreshTokenExpiresAfter: Int
  }
`;

module.exports = {
  token,
};
