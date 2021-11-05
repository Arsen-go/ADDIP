const { gql } = require("apollo-server");

const query = gql`
  type Query {  
    ##### Admin ####
    ##### Mobile ####
    profileAttachments (id: String!): [Attachment]
    thisUser: User
    userQuestions (limit: Float, skip: Float): [Question]
    ##### General ####
  }

  type Mutation {
    #### Admin ####
    signInAdmin (email: String!, password: String!): Token
    #### Mobile ####
    authenticateUser (code: String!, email: String!): Token
    createAttachment (id: String,contentType: String, pixelWidth: Float, pixelHeight: Float, size: String, name: String): Attachment!
    verifyEmail (email: String!): String
    createUserProfile (firstName: String!, lastName: String!, birthDate: String!, gender: String!): User
    createQuestion (headerText: String!, text: String!, keyWords: [String], attachmentIds: [String], faculty: String, course: Float): Question
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
