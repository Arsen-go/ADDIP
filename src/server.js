require("./db");
require("dotenv").config();
const { createServer } = require("http")
const { execute, subscribe } = require("graphql");
const { SubscriptionServer } = require("subscriptions-transport-ws");
const { makeExecutableSchema } = require("@graphql-tools/schema");
const { resolvers } = require("./resolvers");
const typeDefs = require("./typeDefs");
const { tradeTokenForUser } = require("./auth");
const cors = require("cors");
const { ApolloServer, express, bodyParser } = require("./constants");

(async function () {
  const app = express();
  app.use(cors());
  const httpServer = createServer(app);
  app.use(bodyParser.urlencoded({ extended: false }));

  const schema = makeExecutableSchema({
    typeDefs,
    resolvers,
  });

  const subscriptionServer = SubscriptionServer.create(
    { schema, execute, subscribe },
    { server: httpServer, path: '/graphql' }
  );

  const server = new ApolloServer({
    schema,
    cacheControl: false,
    introspection: true,
    playground: true,
    context: async ({ req, connection, payload }) => {
      let authToken = null;
      let currentUser = null;
      let currentDriver = null;
      let admin = null;
      let subscriptionContext = null;

      try {
        authToken = req ? req.headers.authtoken : null;
        if (connection && connection.context) {
          subscriptionContext = connection.context;
        }

        if (authToken) {
          const { decodedUser, decodedDriver, decodedAdmin } = await tradeTokenForUser(authToken);
          currentUser = decodedUser;
          currentDriver = decodedDriver;
          admin = decodedAdmin;
        }
      } catch (e) {
        console.log(e);
      }

      return {
        authToken,
        currentUser,
        currentDriver,
        admin,
        subscriber: subscriptionContext,
        ipAddress: req
          ? req.connection
            ? req.connection.remoteAddress
            : ""
          : "",
      };
    },
    plugins: [{
      async serverWillStart() {
        return {
          async drainServer() {
            subscriptionServer.close();
          }
        };
      }
    }],
  });
  await server.start();
  server.applyMiddleware({ app });

  const PORT = 4000;
  httpServer.listen(process.env.PORT || PORT, () =>
    console.log(`Server is now running on http://localhost:${PORT}/graphql`)
  );
})();
