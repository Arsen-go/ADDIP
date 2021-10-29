const db = require("mongoose");
require("dotenv").config();

// db.set("useCreateIndex", true);
// db.set("useFindAndModify", false);

// MongoClient.connect('mongodb://user:password@domain.com:port/dbname',
const connectionPath = `mongodb://${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`;
// const connectionPath = "mongodb+srv://ADR:socialnetwork@cluster0.duqbf.mongodb.net/drivehop?retryWrites=true&w=majority"

db.connection.on("connected", () => {});

// If the connection throws an error
db.connection.on("error", (err) => {
  console.log(err);
});

// When the connection is disconnected
db.connection.on("disconnected", () => {});

const gracefulExit = () => {
  db.connection.close(() => {
    process.exit(0);
  });
};

// If the Node process ends, close the Mongoose connection
process.on("SIGINT", gracefulExit).on("SIGTERM", gracefulExit);

db.connect(
  connectionPath,
  { useFindAndModify: false, useUnifiedTopology: true, useNewUrlParser: true, setDefaultsOnInsert: true },
  () => {
    console.log("connected to database");
  }
);

module.exports = { db };
