const { gql } = require('apollo-server');

const attachment = gql`
type Attachment {
    id: String!
    fileId: String!
    uploadLink: String!
    downloadLink: String!
    owner: String!
    pixelWidth: Int
    pixelHeight: Int
    size: Int
    createdDate: String!
    contentType: String!
    name: String
  }
`;

module.exports = {
  attachment,
};
