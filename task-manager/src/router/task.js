const express = require("express");
const Task = require("../models/task");

const router = new express.Router();

router.get("/tasks", async (req, res) => {
  try {
    const tasks = await Task.find({});
    res.send(tasks);
  } catch (err) {
    res.status(500).send(err);
  }
});

router.post("/tasks", async (req, res) => {
  const task = new Task(req.body);
  try {
    await task.save();
    res.status(201).send(task);
  } catch (err) {
    res.status(400).send(err);
  }
});

router.patch("/task/:id", async (req, res) => {
  const {
    params: { id: _id }
  } = req;
  const updates = Object.keys(req.body);
  const allowedUpdates = ["description", "completed"];
  const isValidOperation = updates.every(item => allowedUpdates.includes(item));

  if (!isValidOperation)
    return res.status(400).send({ error: "Invalid updates" });

  try {
    const task = await Task.findByIdAndUpdate(_id, req.body, {
      new: true,
      runValidators: true
    });
    if (!task) return res.status(404).send();
    res.send(task);
  } catch (err) {
    res.status(400).send(err);
  }
});

router.delete("/task/:id", async (req, res) => {
  const {
    params: { id: _id }
  } = req;
  try {
    const task = await Task.findByIdAndDelete(_id);
    if (!task) return res.status(404).send(); // if there is no task to delete with the given id
    res.send(task);
  } catch (err) {
    res.status(500).send(err);
  }
});

module.exports = router;
