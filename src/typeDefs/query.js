const { gql } = require("apollo-server");

const query = gql`
  type Query {  
    ##### Admin ####
    ##### Mobile ####
    profileAttachments (id: String!): [Attachment]
    thisUser: User
    ##### General ####
  }

  type Mutation {
    #### Admin ####
    #### Mobile ####
    authenticateUser (code: String!, email: String!): Token
    createAttachment (id: String,contentType: String, pixelWidth: Float, pixelHeight: Float, size: String, name: String): Attachment!
    verifyEmail (email: String!): String
    createUserProfile (firstName: String!, lastName: String!, birthDate: String!, gender: String!): User
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
