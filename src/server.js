require("dotenv").config();
const { http, ApolloServer, express, bodyParser } = require("./constants");
require("./db");
const cors = require("cors");
const { tradeTokenForUser } = require("./auth");
const typeDefs = require("./typeDefs");
const { resolvers } = require("./resolvers");

const app = express();
app.use(cors());

// graphql endpoint
const server = new ApolloServer({
  typeDefs: typeDefs,
  resolvers: resolvers,
  cacheControl: false,
  introspection: true,
  playground: true,
  context: async ({ req, connection, payload }) => {
    let authToken = null;
    let currentUser = null;
    let admin = null;
    let subscriptionContext = null;

    try {
      authToken = req ? req.headers.authentication : null;
      if (connection && connection.context) {
        subscriptionContext = connection.context;
      }

      if (authToken) {
        const { decodedUser, decodedAdmin } = await tradeTokenForUser(authToken);
        currentUser = decodedUser;
        admin = decodedAdmin;
      }
    } catch (e) {
      console.log(e);
    }

    return {
      authToken,
      currentUser,
      admin,
      subscriber: subscriptionContext,
      ipAddress: req
        ? req.connection
          ? req.connection.remoteAddress
          : ""
        : "",
    };
  },
  subscriptions: {
    onConnect: async (connectionParams, webSocket, context) => {
      if (connectionParams.authentication) {
        const { decodedUser, decodedAdmin } = await tradeTokenForUser(connectionParams.authentication);
        currentUser = decodedUser;
        admin = decodedAdmin;
        const context = {
          currentUser,
          admin
        };

        return context;
      }

      throw new Error('Missing auth token!');
    },
    onDisconnect: () => {
      console.log("disconnected user");
    },
  },
});


app.use(bodyParser.urlencoded({ extended: false }));
const httpServer = http.createServer(app);
server.installSubscriptionHandlers(httpServer);
app.use('/assets', express.static("assets"));

httpServer.listen(process.env.PORT || 3000, () => {
  console.log(`🚀 Server ready at /${3000}${server.graphqlPath}`);
  console.log(`🚀 Subscriptions ready /${3000}${server.subscriptionsPath}`);
});
server.applyMiddleware({ app });
