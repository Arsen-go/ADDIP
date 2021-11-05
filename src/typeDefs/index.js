const { user, attachment, token, comment, question, answer } = require("./types");
const { query } = require("./query");

const typeDefs = [query, user, attachment, token, comment, question, answer];

module.exports = typeDefs;