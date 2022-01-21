const { gql } = require("apollo-server");

const question = gql`
type Question {
    id: String!
    text: String
    vote: Int
    views: Int
    isAnswered: Boolean
    keyWords: [String]
    headerText: String
    userThatAnswered: User
    answer: [Answer]
    owner: User
    attachments: [Attachment]
    faculty: String
    course: Int
    comments: [Comment]
  }
`;

module.exports = {
    question,
};