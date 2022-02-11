require('dotenv').config();
const { ApolloError } = require('../constants');
const { authenticated, roleAuthentication } = require('../auth');
const { User, Attachment } = require('../models');

let validator, repository;

class PollResolver {
    constructor({ pollValidator, pollRepository }) {
        validator = pollValidator;
        repository = pollRepository;
    };

    Query = {

    };


    Mutation = {
        createPoll: roleAuthentication(["USER", "ADMIN"], async (_, { question, options, duration }, { currentUser }) => {
            return await repository.createPoll({ question, options, duration, currentUser });
        }),
    };
};


module.exports = PollResolver;