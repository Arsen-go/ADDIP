const { ApolloError, uniqid } = require("../constants");
const { User } = require("../models");

class UserRepository {
    async createUserProfile(currentUser, firstName, lastName, birthDate, gender) {
        try {
            const user = new User({
                id: `us_${uniqid()}`,
                firstName,
                lastName,
                birthDate: new Date(birthDate),
                gender,
                email: currentUser.email
            });

            return await user.save();
        } catch (error) {
            throw new ApolloError(error);
        }
    }
};

module.exports = UserRepository;
