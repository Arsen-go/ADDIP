const { gql } = require("apollo-server");

const answer = gql`
type Answer {
    id: String!
    text: String
    vote: Int
    views: Int
    isThisTrue: Boolean
    comment: [Comment]
    question: Question
    owner: User
    attachments: [Attachment]
  }
`;

module.exports = {
    answer,
};