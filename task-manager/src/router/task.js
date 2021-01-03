const express = require("express");
const Task = require("../models/task");
const auth = require("../middleware/auth");
const router = new express.Router();

router.post("/tasks", auth, async (req, res) => {
  const task = new Task({ ...req.body, owner: req.user._id });
  try {
    await task.save();
    res.status(201).send(task);
  } catch (err) {
    res.status(400).send(err);
  }
});

router.get("/tasks", auth, async (req, res) => {
  try {
    // 2 ways to do it.. one is commented
    // const tasks = await Task.find({ owner: req.user._id });
    // res.send(tasks);
    await req.user.populate("tasks").execPopulate();
    res.send(req.user.tasks);
  } catch (err) {
    res.status(500).send(err);
  }
});

router.get("/task/:id", auth, async (req, res) => {
  const {
    params: { id: _id }
  } = req;
  try {
    const task = await Task.findOne({ _id, owner: req.user.id });
    if (!task) return res.status(404).send();
    res.send(task);
  } catch (err) {
    res.status(500).send(err);
  }
});

router.patch("/task/:id", auth, async (req, res) => {
  const {
    params: { id: _id }
  } = req;
  const updates = Object.keys(req.body);
  const allowedUpdates = ["description", "completed"];
  const isValidOperation = updates.every(item => allowedUpdates.includes(item));

  if (!isValidOperation)
    return res.status(400).send({ error: "Invalid updates" });

  try {
    const task = await Task.findOne({ _id, owner: req.user._id });

    if (!task) return res.status(404).send();

    updates.forEach(key => (task[key] = req.body[key]));
    await task.save();

    res.send(task);
  } catch (err) {
    res.status(400).send(err);
  }
});

router.delete("/task/:id", auth, async (req, res) => {
  const {
    params: { id: _id }
  } = req;
  try {
    const task = await Task.findOneAndDelete({ _id, owner: req.user._id });
    if (!task) return res.status(404).send(); // if there is no task to delete with the given id
    res.send(task);
  } catch (err) {
    res.status(500).send(err);
  }
});

module.exports = router;
