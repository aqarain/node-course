const express = require("express");
const User = require("../models/user");

const router = new express.Router();

router.post("/users", async (req, res) => {
  const user = new User(req.body);
  try {
    await user.save();
    res.status(201).send(user);
  } catch (err) {
    res.status(400).send(err);
  }
});

router.get("/users", async (req, res) => {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (err) {
    res.status(500).send();
  }
});

router.get("/user/:id", async (req, res) => {
  const _id = req.params.id;
  try {
    const user = await User.findById(_id);
    if (!user) return res.status(404).send();
    res.send(user);
  } catch (err) {
    res.status(500).send();
  }
});

router.patch("/user/:id", async (req, res) => {
  const {
    params: { id: _id }
  } = req;
  const updates = Object.keys(req.body);
  const allowedUpdates = ["name", "email", "password", "age"]; // fields that can be updated
  const isValidOperation = updates.every(item => allowedUpdates.includes(item));

  if (!isValidOperation)
    return res.status(400).send({ error: "Invalid updates!" });

  /* The above code make sures that user is provided with proper error message if he tries to update fields 
      that don't exist on document for e.g. if user tries to update "height" in body
    */
  try {
    const user = await User.findById(_id);
    updates.forEach(key => (user[key] = req.body[key])); // This will update all the keys in body on user
    await user.save();

    if (!user) return res.status(404).send(); // if there is no user to update with that id
    res.send(user);
  } catch (err) {
    res.status(400).send(err);
  }
});

router.delete("/user/:id", async (req, res) => {
  const {
    params: { id: _id }
  } = req;
  try {
    const user = await User.findByIdAndDelete(_id);
    if (!user) return res.status(404).send(); // if there is no user to delete with the given id
    res.send(user);
  } catch (err) {
    res.status(500).send(err);
  }
});

module.exports = router;
