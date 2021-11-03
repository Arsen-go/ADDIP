require("dotenv").config();
const mongoose = require("mongoose");
const uri = "mongodb+srv://ADR:socialnetwork@cluster0.duqbf.mongodb.net/helpMe?retryWrites=true&w=majority";
mongoose
  // eslint-disable-next-line no-undef
  .connect(uri, {
    useNewUrlParser: true,
  })
  .then(x => {
    console.log(
      `Connected to Mongo! Database name: "${x.connections[0].name}"`
    );
  })
  .catch(err => {
    console.error("Error connecting to mongo", err);
  });