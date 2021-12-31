const { uniqid, jsonwebtoken, ApolloError } = require("../constants");
const { Admin } = require("../models");

class AdminRepository {
    async signInAdmin(email, password) {
        const isTrue = await Admin.findOne({ email, password });
        if (!isTrue) {
            throw new ApolloError("Login or password is not true.")
        }
        try {
            const token = await this._createToken("ADMIN", email, `admin_${uniqid()}`);
            return { authToken: token };
        } catch (error) {
            throw error;
        }
    };

    async _createToken(role, email, id) {
        const authToken = jsonwebtoken.sign(
            {
                role: role.toUpperCase(),
                email,
                id,
                metadata: "authToken"
            },
            "esimanushhayastaniarevahambarnemsirum",
            { expiresIn: "1y" }
        );
        return authToken;
    };
};

module.exports = AdminRepository;