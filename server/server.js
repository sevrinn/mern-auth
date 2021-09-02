//import express and other libraries
const express = require("express");
const app = express();

require("dotenv").config();
console.log(process.env.SECRET_KEY);
console.log(process.env.PORT);

//declare port
// const port = 8000;
//port is now declared in .env

//configre express server
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//configure mongoose to connect
require("./config/mongoose.config");

//add routes to listen
require("./routes/user.routes")(app);
//start the server listening
app.listen(process.env.PORT, () => {
  console.log("Listening on port" + process.env.PORT);
});

const cookieParser = require("cookie-parser");
const cors = require("cors");

app.use(cookieParser());
app.use(cors({ credentials: true, origin: process.env.CLIENT_URL }));
