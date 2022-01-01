const { gql } = require('apollo-server');

const message = gql`
scalar DateTime

type Message {
    id: String!
    message: String
    attachments: [Attachment]
    conversation: Conversation!
    owner: User!
    createdDate: DateTime!
    lookedUsers: [User]
    lookedDates: [MessageLookedDate]
  }
`;

module.exports = {
  message,
};
