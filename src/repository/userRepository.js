const { ApolloError, uniqid } = require("../constants");
const { User } = require("../models");

class UserRepository {
    constructor(authRepository) {
        this.auth = authRepository;
    };

    async createUserProfile(currentUser, firstName, lastName, birthDate, password) {
        try {
            const user = new User({
                id: currentUser.id,
                firstName,
                lastName,
                birthDate: new Date(birthDate),
                email: currentUser.email,
                password
            });

            return await user.save();
        } catch (error) {
            throw new ApolloError(error);
        }
    };

    async signInUser(email, password) {
        const user = await User.findOne({ email, password });
        if (!user) {
            throw new ApolloError("Email or Password are wrong.", 404);
        }
        try {
            const authToken = await this.auth._createToken("USER", email, user.id);
            const refreshToken = await this.auth._createRefreshToken("USER", email, user.id);
            const tokenExpiresAfter = 86400;
            const refreshTokenExpiresAfter = 31363200;
    
            return { authToken, tokenExpiresAfter, refreshToken, refreshTokenExpiresAfter };
        } catch (error) {
            throw new Error(error, 555);
        }
    };

    async deleteMe(currentUser) {
        const user = await User.findOne({ id: currentUser.id });
        if (!user) {
            throw new ApolloError("Email or Password are wrong.", 404);
        }
        try {
            await User.deleteOne({ _id: user._id });
            return "";
        } catch (error) {
            throw new Error(error, 555);
        }
    };

    async getUsers(limit, skip) {
        try {
            return await User.find({}).limit(limit).skip(skip);
        } catch (error) {
            throw new Error(error, 555);
        }
    }
};

module.exports = UserRepository;
