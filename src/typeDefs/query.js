const { gql } = require("apollo-server");

const query = gql`
  scalar Date

  type Query {  
    ##### Admin ####
    ##### Mobile ####
    profileAttachments (id: String!): [Attachment]
    thisUser: User
    userQuestions (limit: Int, skip: Int): [Question]
    questions (limit: Int, skip: Int): [Question]
    searchQuestions (text: String): [Question]
    questionById (id: String!): Question
    answersByQuestionId (questionId: String!): [Answer]
    #Chat#
    getConversations: [Conversation]
    messagesByConversationId (conversationId: String, limit: Int, skip: Int): [Message]
    conversationById (conversationId: String!): Conversation
    ##### General ####
    deleteMe: String
    getUsers (limit: Int!, skip: Int!): [User]
  }

  type Mutation {
    #### Admin ####
    signInAdmin (email: String!, password: String!): Token
    createPoll (question: String!, options: [String!], duration: Date!): Token
    #### General ####
    #### Mobile ####
    authenticateUser (code: String!, email: String!): Token
    signInUser (email: String!, password: String!): Token
    createAttachment (id: String,contentType: String, pixelWidth: Float, pixelHeight: Float, size: String, name: String): Attachment!
    verifyEmail (email: String!, isVisitor: Boolean): String
    createUserProfile (firstName: String!, lastName: String!, birthDate: String!, password: String!, faculty: String, course: Int): User
    editUserProfile (firstName: String, lastName: String, birthDate: String, password: String, faculty: String, course: Int): User
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
    questionAdded: Question
    questionAnswered (questionIds: [String!]): Question
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
