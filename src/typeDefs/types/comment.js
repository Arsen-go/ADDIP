const { gql } = require("apollo-server");

const comment = gql`
type Comment {
    id: String!
    text: String
    vote: Int
    views: Int
    owner: User
    answer: [Answer]
    attachments: [Attachment]
    question: Question
  }
`;

module.exports = {
    comment,
};