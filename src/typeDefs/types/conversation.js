const { gql } = require('apollo-server');

const conversation = gql`
type Conversation {
    id: String!
    title: String!,
    desc: String!,
    users: [User]!
    owner: User!
    createdDate: Date!
    attachment: Attachment
    isIndividual: Boolean
    isPrivate: Boolean
    lastUpdatedDate: Date
    messages: [Message]
    #invites: [ConversationInvite]
  }
`;

module.exports = {
  conversation,
};
