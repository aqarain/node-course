const mongoose = require("mongoose");
const validator = require("validator");

// "task-manager-api" is the db name
mongoose.connect(process.env.MONGODB_URL, {
  useNewUrlParser: true,
  useCreateIndex: true
});
