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
    authenticateUser (token: String!, phone: String!): Token
    createAttachment (id: String,contentType: String, pixelWidth: Float, pixelHeight: Float, size: String, name: String): Attachment!
    verifyPhone (phone: String!): String
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
