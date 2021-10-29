const { user, attachment, token } = require("./types");
const { query } = require("./query");

const typeDefs = [query, user, attachment, token];

module.exports = typeDefs;