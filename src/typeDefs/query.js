const { gql } = require("apollo-server");

const query = gql`
  type Query {  
    ##### Admin ####
    ##### Mobile ####
    profileAttachments (id: String!): [Attachment]
    thisUser: User
    userQuestions (limit: Float, skip: Float): [Question]
    ##### General ####
    deleteMe: String
  }

  type Mutation {
    #### Admin ####
    signInAdmin (email: String!, password: String!): Token
    #### Mobile ####
    authenticateUser (code: String!, email: String!): Token
    signInUser (email: String!, password: String!): Token
    createAttachment (id: String,contentType: String, pixelWidth: Float, pixelHeight: Float, size: String, name: String): Attachment!
    verifyEmail (email: String!): String
    createUserProfile (firstName: String!, lastName: String!, birthDate: String!, password: String!): User
    createQuestion (headerText: String!, text: String!, keyWords: [String], attachmentIds: [String], faculty: String, course: Float): Question
    editQuestion (questionId: String!, headerText: String, text: String, keyWords: [String], attachmentIds: [String], faculty: String, course: Float): Question
    answerQuestion (questionId: String!, answer: String!, attachmentIds: [String]): Answer
    setCorrectAnswer (answerId: String!): Answer
    addCommentToQuestion (questionId: String!, text: String!, attachmentIds: [String]): Comment
    addCommentToAnswer (answerId: String!, text: String!, attachmentIds: [String]): Comment
    voteQuestion (questionId: String!): Question
    voteAnswer (answerId: String!): Answer
    voteComment (commentId: String!): Comment
    deleteComment (commentId: String!): Boolean
    deleteAnswer (answerId: String!): Boolean
    #### General ####
  }

  schema {
    query: Query
    mutation: Mutation
  }
`;

module.exports = {
  query,
};
