require("../src/db/mongoose");
const Task = require("../src/models/task");

Task.findByIdAndDelete("5fecd7d94aa6fd45c0f6f257", { completed: true })
  .then(task => {
    console.log(task);
    return Task.countDocuments({ completed: true });
  })
  .then(result => {
    console.log(result);
  })
  .catch(err => {
    console.log(err);
  });
