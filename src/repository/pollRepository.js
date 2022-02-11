const { ApolloError } = require("../constants");
const { User } = require("../models");

class PollRepository {
    async createPoll({question, options, duration, currentUser}) {
        try{

        } catch (error) {
            throw new ApolloError(error, 555);
        }
    };
};

module.exports = PollRepository;
