const mongoose = require("mongoose");
const validator = require("validator");

// Creating a model
const User = mongoose.model("User", {
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

module.exports = User;
