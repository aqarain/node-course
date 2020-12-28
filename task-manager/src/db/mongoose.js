const mongoose = require("mongoose");

// "task-manager-api" is the db name
mongoose.connect("mongodb://127.0.0.1:27017/task-manager-api", {
  useNewUrlParser: true,
  useCreateIndex: true
});

// Creating a model
// const User = mongoose.model("User", {
//   name: { type: String },
//   age: { type: Number }
// });

// // Creating an instance of the model
// const me = new User({ name: "Atif", age: 28 });

// // Saving the instance of that model to the database
// me.save()
//   .then(result => {
//     console.log(result);
//   })
//   .catch(err => {
//     console.log(`Error! ${err}`);
//   });

const Task = mongoose.model("Task", {
  description: { type: String },
  completed: { type: Boolean }
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
