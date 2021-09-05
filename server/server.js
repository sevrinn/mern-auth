//start loading with the .env file date
//this way we can use it everywhere in our server
require("dotenv").config();
//import express and other libraries
const express = require("express");
const app = express();
const jwt = require("jsonwebtoken");
const cors = require("cors");
const cookieParser = require("cookie-parser");

//configre express server
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    //adding the ability to use credentials with cookies
    credentials: true,
    origin: process.env.CLIENT_URL,
  })
);

//configure server to accept and update cookies
app.use(cookieParser());

//configure mongoose to connect
require("./config/mongoose.config");

//add routes to listen
const userRoutes = require("./routes/user.routes")(app);

app.listen(process.env.PORT, () => {
  console.log("Listening on port " + process.env.PORT);
});
