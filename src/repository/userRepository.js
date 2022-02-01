const { ApolloError } = require("../constants");
const { User, Question, Conversation } = require("../models");

class UserRepository {
    constructor(authRepository, questionRepository, conversationRepository) {
        this.auth = authRepository;
        this.questionRepository = questionRepository;
        this.conversationRepository = conversationRepository;
    };

    async createUserProfile(currentUser, firstName, lastName, birthDate, password, faculty, course) {
        try {
            const user = new User({
                id: currentUser.id,
                firstName,
                lastName,
                birthDate: new Date(birthDate),
                email: currentUser.email,
                password,
                faculty, course
            });

            return await user.save();
        } catch (error) {
            throw new ApolloError(error);
        }
    };

    async editUserProfile(currentUser, firstName, lastName, birthDate, password, faculty, course) {
        try {
            const editedUser = await User.findOneAndUpdate({ id: currentUser.id }, {
                firstName, lastName, birthDate, password, faculty, course
            }, { upsert: true });
            return editedUser;
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
            throw new ApolloError("User is already not exist", 404);
        }
        const userQuestions = await Question.find({ owner: user._id });
        for (const q of userQuestions) {
            await this.questionRepository.deleteQuestion(user, q.id);
        }

        const conversations = await Conversation.find({ owner: user._id });
        for (const c of conversations) {
            await this.conversationRepository.deleteConversation(c);
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
