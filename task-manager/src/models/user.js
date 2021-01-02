const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

// Creating the Schema explicitly
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true // means space will be trimmed in name before saving to collection
  },
  age: {
    type: Number,
    default: 0, // if no age is provided as it is not required, default age will be 0
    validate(value) {
      if (value < 0) throw new Error("Age must be a positive number");
    }
  },
  email: {
    type: String,
    required: true,
    lowercase: true, // means email will be converted to lowercase before saving to collection
    validate(value) {
      if (!validator.isEmail(value)) throw new Error("Email is invalid");
    }
  },
  password: {
    type: String,
    required: true,
    trim: true,
    validate(value) {
      if (value.length < 6) throw new Error("length should be greater than 6");
      if (value.toLowerCase().includes("password"))
        throw new Error("length should not contain 'password' text");
    }
  }
});

// Utilizing Middleware - run before/pre save the below function
userSchema.pre("save", async function (next) {
  const user = this;

  // hashing the password only if it hasn't been hashed before
  if (user.isModified("password")) {
    // true first time the password is added and when password is changed

    /* bcrypt.hash(,8) - 8 is the standard number of rounds. More than that will make the hashing process slow
      and less than that is not safe and easy to decrypt
    */
    user.password = await bcrypt.hash(user.password, 8);
  }

  /*
  The whole point of this function is to run some code before a user is saved. calling next() tells us that we 
  are done running our code for e.g. hashing the password and now you can save the user.
  If we don't call next(), the code will get stuck here in this function and user will never be saved
  */
  next();
});

// Creating a model
const User = mongoose.model("User", userSchema);

module.exports = User;
