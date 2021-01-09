const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Task = require("./task");

// Creating the Schema explicitly
const userSchema = new mongoose.Schema(
  {
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
      unique: true,
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
        if (value.length < 6)
          throw new Error("length should be greater than 6");
        if (value.toLowerCase().includes("password"))
          throw new Error("length should not contain 'password' text");
      }
    },
    tokens: [
      {
        token: {
          type: String,
          required: true
        }
      }
    ],
    avatar: { type: Buffer }
  },
  {
    timestamps: true
  }
);

/**
 * Setting up a virtual property which creates a relationship between tasks and user
 * virtual() allows us to set up virtual attirbutes means it is not stored in the DB like "owner" field in Task
 * It is just for Mongoose to figure out who owns what and how they are related
 */
userSchema.virtual("tasks", {
  ref: "Task",
  localField: "_id",
  foreignField: "owner"
});

/*
When we pass an object to res.send({user}) in our router/user.js file, expressJS behind the scenes call
JSON.stringify().
*/
userSchema.methods.toJSON = function () {
  const user = this;
  const userObject = user.toObject();
  delete userObject.password;
  delete userObject.tokens;
  delete userObject.avatar;
  return userObject;
};

//
userSchema.statics.findByCredentials = async (email, password) => {
  const user = await User.findOne({ email });
  if (!user) throw new Error("Unable to login!");
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error("Unable to login!");
  return user;
};

//
userSchema.methods.generateAuthToken = async function () {
  const user = this;
  const token = jwt.sign({ _id: user._id.toString() }, "thisismynewcourse");
  user.tokens = user.tokens.concat({ token });
  await user.save();
  return token;
};

// Utilizing Middleware for Password Hashing- run before/pre save the below function
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

// Delete user tasks if user is removed
userSchema.pre("remove", async function (next) {
  const user = this;
  await Task.deleteMany({ owner: user._id });
  next();
});

// Creating a model
const User = mongoose.model("User", userSchema);

module.exports = User;
