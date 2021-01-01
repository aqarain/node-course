const mongoose = require("mongoose");
const validator = require("validator");

// "task-manager-api" is the db name
mongoose.connect("mongodb://127.0.0.1:27017/task-manager-api", {
  useNewUrlParser: true,
  useCreateIndex: true
});

// Creating a model
// const User = mongoose.model("User", {
//   name: {
//     type: String,
//     required: true,
//     trim: true // means space will be trimmed in name before saving to collection
//   },
//   age: {
//     type: Number,
//     default: 0, // if no age is provided as it is not required, default age will be 0
//     validate(value) {
//       if (value < 0) throw new Error("Age must be a positive number");
//     }
//   },
//   email: {
//     type: String,
//     required: true,
//     lowercase: true, // means email will be converted to lowercase before saving to collection
//     validate(value) {
//       if (!validator.isEmail(value)) throw new Error("Email is invalid");
//     }
//   },
//   password: {
//     type: String,
//     required: true,
//     trim: true,
//     validate(value) {
//       if (value.length < 6) throw new Error("length should be greater than 6");
//       if (value.toLowerCase().includes("password"))
//         throw new Error("length should not contain 'password' text");
//     }
//   }
// });

// // Creating an instance of the model
// const me = new User({
//   name: "Mike   ",
//   email: "MIKE@gmail.com",
//   password: "hello123"
// });

// // Saving the instance of that model to the database
// me.save()
//   .then(result => {
//     console.log(result);
//   })
//   .catch(err => {
//     console.log(`Error! ${err}`);
//   });

const Task = mongoose.model("Task", {
  description: { type: String, trim: true, required: true },
  completed: { type: Boolean, default: false }
});
const task = new Task({ description: "a", completed: true });
task
  .save()
  .then(result => {
    console.log(result);
  })
  .catch(err => {
    console.log(err);
  });
