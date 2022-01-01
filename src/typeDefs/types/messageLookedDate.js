const { gql } = require('apollo-server');

const messageLookedDate = gql`
type MessageLookedDate {
    id: String!
    user: User
    createdDate: DateTime
  }
`;

module.exports = {
  messageLookedDate,
};
