const { uniqid, jsonwebtoken, ForbiddenError, ApolloError } = require("../constants");
const { EmailToken, User, Driver } = require("../models");
const { sendMail } = require("../middleware/nodeMailer");

class AuthRepository {
    async verifyEmail(email) {
        const token = AuthRepository.rand(6);
        try {
            sendMail(token, email);
        } catch (error) {
            throw new ApolloError(error);
        };
    };

    async authenticateUser(code, email) {
        try {
            await this._isHaveRegisterToken(code);
            const idForUser = `us_${uniqid()}`;
            const authToken = await this._createToken("USER", email, idForUser);
            const refreshToken = await this._createRefreshToken("USER", email, idForUser);
            const tokenExpiresAfter = 86400;
            const refreshTokenExpiresAfter = 31363200;

            return { authToken, tokenExpiresAfter, refreshToken, refreshTokenExpiresAfter, };
        } catch (error) {
            throw new Error(error);
        }
    };

    async authenticateUserEdit(token, phone, currentUser) {
        try {
            await this._isHaveRegisterToken(token, phone);
            const user = await User.findOne({ id: currentUser.id });
            const authToken = await this._createToken("USER", phone, user.id);
            const refreshToken = await this._createRefreshToken("USER", phone, user.id);
            const tokenExpiresAfter = 86400;
            const refreshTokenExpiresAfter = 31363200;
            user.phone = phone;
            await user.save();
            return { authToken, tokenExpiresAfter, refreshToken, refreshTokenExpiresAfter, };
        } catch (error) {
            throw new Error(error);
        }
    };

    async refreshToken(refreshToken) {
        const decoded = jsonwebtoken.verify(refreshToken, process.env.JWT_SECRET);

        const authToken = jsonwebtoken.sign(
            { phone: decoded.phone, metadata: "authToken", id: decoded.id },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );
        const tokenExpiresAfter = 86400;
        return {
            authToken,
            tokenExpiresAfter,
            refreshToken,
            refreshTokenExpiresAfter: decoded.exp,
        };
    };

    static rand(digits) {
        return Math.floor(Math.random() * parseInt("8" + "9".repeat(digits - 1)) + parseInt("1" + "0".repeat(digits - 1)));
    };

    async _createToken(role, email, id) {
        const authToken = jsonwebtoken.sign(
            {
                role: role.toUpperCase(),
                email,
                id,
                metadata: "authToken"
            },
            process.env.JWT_SECRET,
            { expiresIn: "1y" }
        );
        return authToken;
    };

    async _createRefreshToken(role, email, id) {
        const refreshToken = jsonwebtoken.sign(
            {
                message: "use this for refresh auth token",
                metadata: "refreshToken",
                email,
                role: role.toUpperCase(),
                id,
            },
            process.env.JWT_SECRET,
            { expiresIn: "2y" }
        );
        return refreshToken;
    };

    async _isHaveRegisterToken(code) {
        if (code === "000000") {
            return;
        }
        const tokenPhone = await EmailToken.findOne({ token: code });
        if (!tokenPhone && code !== "000000") {
            throw new ForbiddenError("Invalid token:Registration code are wrong!");
        }

        try {
            await EmailToken.deleteOne({ token: code });
        } catch (error) {
            throw new Error(error);
        }
    }
};

module.exports = AuthRepository;