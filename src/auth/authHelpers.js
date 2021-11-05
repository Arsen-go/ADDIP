const { jsonwebtoken } = require("../constants");

const tradeTokenForUser = (token) => {
  if (token) {
    let decodedUser, decodedAdmin;
    token = token.replace("Bearer ", "");
    const decoded =  jsonwebtoken.verify(token, process.env.JWT_SECRET);

    if (decoded.metadata === "authToken") {
      if (decoded.role === "USER") {
        decodedUser = decoded;
      }

      if (decoded.role === "ADMIN") {
        decodedAdmin = decoded;
      }
    }

    return { decodedUser, decodedAdmin };
  } else {
    return null;
  }
};

module.exports = { tradeTokenForUser };
