require("dotenv").config();
const { http, ApolloServer, express, bodyParser } = require("./constants");
require("./db");
const cors = require("cors");
const { tradeTokenForUser } = require("./auth");
const typeDefs = require("./typeDefs");
const { resolvers } = require("./resolvers");
const app = express();
app.use(cors());
const { ApolloServerPluginLandingPageGraphQLPlayground } = require("apollo-server-core");
const { SubscriptionServer } = require('subscriptions-transport-ws');
const { execute, subscribe } = require('graphql');

let apolloServer = null;
async function startServer() {
  apolloServer = new ApolloServer({
    typeDefs,
    resolvers,
    playground: true,
    introspection: true,
    plugins: [
      ApolloServerPluginLandingPageGraphQLPlayground(),
    ],

    subscriptions: {
      onConnect: async (connectionParams, webSocket, context) => {
        if (connectionParams.authentication) {
          const { decodedUser, decodedDriver, decodedAdmin } = await tradeTokenForUser(connectionParams.authentication);
          currentUser = decodedUser;
          currentDriver = decodedDriver;
          admin = decodedAdmin;
          const context = {
            currentUser,
            currentDriver,
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
    context: async ({ req, connection, payload }) => {
      let authToken = null;
      let currentUser = null;
      let currentAdmin = null;
      let subscriptionContext = null;

      try {
        authToken = req ? req.headers.authtoken : null;
        if (connection && connection.context) {
          subscriptionContext = connection.context;
        }

        if (authToken) {
          const { decodedUser, decodedAdmin } = await tradeTokenForUser(authToken);
          currentUser = decodedUser;
          currentAdmin = decodedAdmin;
          const context = {
            currentUser,
            currentAdmin
          };
          return context;
        }
      } catch (e) {
        console.log(e);
      }

      return {
        authToken,
        currentUser,
      };
    },
  });
  await apolloServer.start();
  apolloServer.applyMiddleware({ app });
  // const subscriptionServer = SubscriptionServer.create({
  //   schema,
  //   execute,
  //   subscribe,
  // }, {
  //   server: apolloServer,
  //   path: '/graphql',
  // });
}
startServer();

app.use(bodyParser.urlencoded({ extended: false }));
const httpServer = http.createServer(app);
app.use('/assets', express.static("assets"));

app.listen(process.env.PORT || 4000, () => {
  console.log(`🚀 Server ready at /${4000}`);
  console.log(`🚀 Subscriptions ready /${4000}`);
});
