const express = require("express");
require("./db/mongoose"); // We don't need anything from this file. Just make sure that mongoose connects to the DB
const userRouter = require("./router/user");
const taskRouter = require("./router/task");

const app = express();

app.use(express.json()); // automatically parse incoming JSON to an object so we can access it in our handlers
app.use(userRouter); // registering the user routers
app.use(taskRouter); // registering the task routers

module.exports = app;
