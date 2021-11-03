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

// graphql endpoint
// const server = new ApolloServer({
//   typeDefs: typeDefs,
//   resolvers: resolvers,
//   cacheControl: false,
//   introspection: true,
//   playground: true,
//   context: async ({ req, connection, payload }) => {
//     let authToken = null;
//     let currentUser = null;
//     let currentDriver = null;
//     let admin = null;
//     let subscriptionContext = null;

//     try {
//       authToken = req ? req.headers.authentication : null;
//       if (connection && connection.context) {
//         subscriptionContext = connection.context;
//       }

//       // if (!authToken) {
//       //   authToken = process.env.TEST_TOKEN;
//       // }

//       if (authToken) {
//         const { decodedUser, decodedDriver, decodedAdmin } = await tradeTokenForUser(authToken);
//         currentUser = decodedUser;
//         currentDriver = decodedDriver;
//         admin = decodedAdmin;
//       }
//     } catch (e) {
//       console.log(e);
//     }

//     return {
//       authToken,
//       currentUser,
//       currentDriver,
//       admin,
//       subscriber: subscriptionContext,
//       ipAddress: req
//         ? req.connection
//           ? req.connection.remoteAddress
//           : ""
//         : "",
//     };
//   },
//   subscriptions: {
//     onConnect: async (connectionParams, webSocket, context) => {
//       if (connectionParams.authentication) {
//         const { decodedUser, decodedDriver, decodedAdmin } = await tradeTokenForUser(connectionParams.authentication);
//         currentUser = decodedUser;
//         currentDriver = decodedDriver;
//         admin = decodedAdmin;
//         const context = {
//           currentUser,
//           currentDriver,
//           admin
//         };

//         return context;
//       }

//       throw new Error('Missing auth token!');
//     },
//     onDisconnect: () => {
//       console.log("disconnected user");
//     },
//   },
// });

let apolloServer = null;
async function startServer() {
  apolloServer = new ApolloServer({
    typeDefs,
    resolvers,
    playground: true,
    plugins: [
      ApolloServerPluginLandingPageGraphQLPlayground(),
    ],
    context: async ({ req, connection, payload }) => {
      let authToken = null;
      let currentUser = null;
      let subscriptionContext = null;

      try {
        authToken = req ? req.headers.authentication : null;
        if (connection && connection.context) {
          subscriptionContext = connection.context;
        }

        if (authToken) {
          const { decodedUser } = await tradeTokenForUser(authToken);
          currentUser = decodedUser;
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
}
startServer();

app.use(bodyParser.urlencoded({ extended: false }));
const httpServer = http.createServer(app);
// server.installSubscriptionHandlers(httpServer);
app.use('/assets', express.static("assets"));

app.listen(process.env.PORT || 4000, () => {
  console.log(`🚀 Server ready at /${4000}${apolloServer.graphqlPath}`);
  console.log(`🚀 Subscriptions ready /${4000}${apolloServer.subscriptionsPath}`);
});
