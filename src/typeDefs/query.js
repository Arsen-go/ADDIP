const { gql } = require("apollo-server");

const query = gql`
  type Query {  
    ##### Admin ####
    ##### Mobile ####
    profileAttachments (id: String!): [Attachment]
    thisUser: User
    userQuestions (limit: Float, skip: Float): [Question]
    questions (limit: Float, skip: Float): [Question]
    searchQuestions (text: String): [Question]
    #Chat#
    getConversations: [Conversation]
    conversationById (conversationId: String!): Conversation
    ##### General ####
    deleteMe: String
    getUsers (limit: Float!, skip: Float!): [User]
  }

  type Mutation {
    #### Admin ####
    signInAdmin (email: String!, password: String!): Token
    #### General ####
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
    deleteQuestion (questionId: String!): Boolean

    #Chat#
    createConversation (title: String!, desc: String, userId: String): Conversation!
    createMessage (message: String, conversationId: String!): Message

    #### General ####
  }

  type Subscription {
    messageAdded (conversationId: String!): Message
  }

  schema {
    query: Query
    mutation: Mutation
    subscription: Subscription
  }
`;

module.exports = {
  query,
};
