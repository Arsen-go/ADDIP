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
    context: async ({ req, connection, payload }) => {
      let authToken = null;
      let currentUser = null;
      let subscriptionContext = null;

      try {
        authToken = req ? req.headers.authtoken : null;
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
app.use('/assets', express.static("assets"));

app.listen(process.env.PORT || 4000, () => {
  console.log(`🚀 Server ready at /${4000}`);
  console.log(`🚀 Subscriptions ready /${4000}`);
});
