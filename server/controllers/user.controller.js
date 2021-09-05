const User = require("../models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

//this is also valid syntax for controller
module.exports = {
  register: (req, res) => {
    console.log("in register");
    console.log(req.body);

    //use request data and User model constructor to create a user object
    const user = new User(req.body);

    user
      .save()
      .then((newUser) => {
        console.log(newUser);
        console.log("Successfully registered");
        res.json({
          message: "Successfully registered",
          user: newUser,
        });
      })
      .catch((err) => {
        console.log("register NOT successful");
        res.status(400).json(err);
      });
  },
  // login
  login: (req, res) => {
    User.findOne({ email: req.body.email })
      .then((userRecord) => {
        // check if this returned obj is null
        if (userRecord == null) {
          //email not found in collection / DB
          res.status(400).json({ message: "Invalid Login Attempt" });
        } else {
          //the email was found
          //compare address given to us in req with the one stored in the DB
          //  basically
          bcrypt
            .compare(req.body.password, userRecord.password)
            .then((isPasswordValid) => {
              if (isPasswordValid) {
                console.log("Password is valid");
                console.log(userRecord);
                console.log(process.env.SECRET_KEY);
                res
                  .cookie(
                    "usertoken", //NAME of the cookie
                    jwt.sign(
                      {
                        //PAYLOAD is the data i want to save
                        user_id: userRecord._id,
                        email: userRecord.email,
                      },
                      process.env.SECRET_KEY
                    ), //used to sign/hash data in the cookie
                    {
                      //CONFIG settings for this cookie
                      httpOnly: true,
                      //this is 25 hours. lol
                      expires: new Date(Date.now() + 9000000),
                    }
                  )
                  .json({
                    message: "Successfully logged in",
                    userLoggedIn: userRecord.username,
                  });
              } else {
                //passwords didnt match
                res.status(400).json({ message: "Invalid Login Attempt" });
              }
            })
            .catch((err) => {
              console.log("error with compare pws");
              res.status(400).json({ message: "Invalid Login Attempt" });
            });
        }
      })
      .catch((err) => {
        console.log("error with find one");
        res.status(400).json({ message: "Invalid Login Attempt" });
      });
  },
  logout: (req, res) => {
    console.log("logging out!");
    res.clearCookie("usertoken"); //same name as above for saving cookie
    res.json({
      message: "You have succesffully logged out",
    });
  },
};
