const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const UserSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "First name is required"],
    },
    lastName: {
      type: String,
      required: [true, "Last name is required"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      validate: {
        validator: (val) => /^([\w-\.]+@([\w-]+\.)+[\w-]+)?$/.test(val),
        message: "Please enter a valid email",
      },
    },
    username: {
      type: String,
      required: [true, "Username is required"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minLength: [8, "Password must be at leaset 8 characters long"],
      //confirmPassword isn NOT included here so it wont be included in the collection
    },
  },
  { timestamps: true }
);

//Virtual field
//  store info from our request, but it wont be saved to the collection /DB
UserSchema.virtual("confirmPassword")

  .get(() => this._confirmPassword)
  .set((value) => (this._confirmPassword = value));

//middleware jumps into the middle of a process...does some work
//  and then it continues with the next step as though it hadnt been interrupted
UserSchema.pre("validate", function (next) {
  console.log("inside pre validate");
  if (this.password !== this.confirmPassword) {
    this.invalidate("confirmPassword", "Password must match confirm password");
  }
  //runs next step in process
  next();
});

UserSchema.pre("save", function (next) {
  // encrypt the password BEFORE it is saved to the DB
  //we KNOW the passwords already match
  console.log("inside pre-save");
  bcrypt
    .hash(this.password, 10)
    .then((hash) => {
      //update password in this instance to use the hashed returned version
      this.password = hash;
      next();
    })
    .catch((err) => {
      console.log("Error while hashing the password");
    });
});

// User will become the name of our collection
//  mongoose will make it lowercase and plural
//  collection name: users
const User = mongoose.model("User", UserSchema);

module.exports = User;
