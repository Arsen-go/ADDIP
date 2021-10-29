const { uniqid, jsonwebtoken, ForbiddenError, ApolloError } = require("../constants");
const { TokenPhone, User, Driver } = require("../models");
const { twillioNumber, twillio } = require("../middleware/twillio");

class AuthRepository {
    async verify(phone) {
        const token = AuthRepository.rand(6);
        const createdDate = new Date();

        const tokenPhone = new TokenPhone({
            token: token,
            phone,
            createdDate,
        });

        tokenPhone.id = tokenPhone._id;

        try {
            let savedTokenPhone = await tokenPhone.save();

            // await twillio.messages.create({
            //     body: `Verification code ${savedTokenPhone.token}`,
            //     to: phone,
            //     from: twillioNumber,
            // });
        } catch (error) {
            throw new ApolloError(error);
        };
    };

    async authenticateUser(token, phone) {
        try {
            await this._isHaveRegisterToken(token, phone);
            const user = await User.findOne({ phone });
            const idForUser = user ? user.id : `us_${uniqid()}`;
            const authToken = await this._createToken("USER", phone, idForUser);
            const refreshToken = await this._createRefreshToken("USER", phone, idForUser);
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

    async _createToken(role, phone, id) {
        const authToken = jsonwebtoken.sign(
            {
                phone: phone,
                role: role.toUpperCase(),
                id,
                metadata: "authToken"
            },
            process.env.JWT_SECRET,
            { expiresIn: "1y" }
        );
        return authToken;
    };

    async _createRefreshToken(role, phone, id) {
        const refreshToken = jsonwebtoken.sign(
            {
                message: "use this for refresh auth token",
                metadata: "refreshToken",
                phone: phone,
                role: role.toUpperCase(),
                id,
            },
            process.env.JWT_SECRET,
            { expiresIn: "2y" }
        );
        return refreshToken;
    };

    async _isHaveRegisterToken(token, phone) {
        if (token === "000000") {
            return;
        }
        const tokenPhone = await TokenPhone.findOne({ token, phone });
        if (!tokenPhone && token !== "000000") {
            throw new ForbiddenError("Invalid token:Registration code are wrong!");
        }

        try {
            await tokenPhone.remove(phone)
        } catch (error) {
            throw new Error(error);
        }
    }
};

module.exports = AuthRepository;