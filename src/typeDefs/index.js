const { user, attachment, token, comment, question, answer, conversation, message, messageLookedDate } = require("./types");
const { query } = require("./query");

const typeDefs = [query, user, attachment, token, comment, question, answer, conversation, message, messageLookedDate];

module.exports = typeDefs;