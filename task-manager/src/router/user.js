const express = require("express");
const User = require("../models/user");
const auth = require("../middleware/auth");
const multer = require("multer");
const sharp = require("sharp");

const router = new express.Router();

router.post("/users", async (req, res) => {
  const user = new User(req.body);
  try {
    await user.save();
    const token = await user.generateAuthToken();
    res.status(201).send({ user, token });
  } catch (err) {
    res.status(400).send(err);
  }
});

router.post("/user/login", async (req, res) => {
  const {
    body: { email, password }
  } = req;
  try {
    const user = await User.findByCredentials(email, password);
    const token = await user.generateAuthToken();
    res.send({ user, token });
  } catch (err) {
    res.status(400).send();
  }
});

router.post("/user/logout", auth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter(
      token => token.token !== req.token
    );
    await req.user.save();
    res.send();
  } catch (err) {
    res.status(500).send();
  }
});

router.post("/user/logoutAll", auth, async (req, res) => {
  try {
    req.user.tokens = [];
    await req.user.save();
    res.send();
  } catch (err) {
    res.status(500).send();
  }
});

router.get("/users/me", auth, async (req, res) => {
  res.send(req.user); // we set the req.user in auth function
});

router.patch("/user/me", auth, async (req, res) => {
  // const {
  //   params: { id: _id }
  // } = req;
  const updates = Object.keys(req.body);
  const allowedUpdates = ["name", "email", "password", "age"]; // fields that can be updated
  const isValidOperation = updates.every(item => allowedUpdates.includes(item));

  if (!isValidOperation)
    return res.status(400).send({ error: "Invalid updates!" });

  /* The above code make sures that user is provided with proper error message if he tries to update fields 
      that don't exist on document for e.g. if user tries to update "height" in body
    */
  try {
    // const user = await User.findById(req.user._id);
    updates.forEach(key => (req.user[key] = req.body[key])); // This will update all the keys in body on user
    await req.user.save();

    res.send(req.user);
  } catch (err) {
    res.status(400).send(err);
  }
});

router.delete("/user/me", auth, async (req, res) => {
  try {
    await req.user.remove();
    res.send(req.user);
  } catch (err) {
    res.status(500).send(err);
  }
});

/***
 * "dest" is the location where the files will be stored
 * "limits: { fileSize } is max file size in bytes (1 MB = 1000000 Bytes)"
 * "fileFilter(req, file, cb){}" takes care of the type of file that can be uploaded
 * */
const upload = multer({
  // dest: "avatars",
  limits: { fileSize: 1000000 },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/))
      return cb(new Error("Please upload an image"));

    cb(undefined, true); // called if file type is correct
  }
});

// Add and Update avatar
router.post(
  "/user/me/avatar",
  auth,
  upload.single("avatar"), // "avatar" is the name of the key in your request body
  async (req, res) => {
    // Image resizing and format changing before saving the image in DB using Sharp library
    const buffer = await sharp(req.file.buffer)
      .resize({ width: 250, height: 250 })
      .png()
      .toBuffer();
    req.user.avatar = buffer;
    await req.user.save();
    res.send();
  },
  /**
   * If we don't add the below code and an error occurs, HTML will be sent back.
   * Now it will send a JSON error message defined in "cb" above in "multer({})" */
  (error, req, res, next) => {
    res.status(400).send({ error: error.message });
  }
);

router.delete("/user/me/avatar", auth, async (req, res) => {
  req.user.avatar = undefined;
  await req.user.save();
  res.send();
});

router.get("/user/:id/avatar", auth, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user || !user.avatar) throw new Error();

    res.setHeader("Content-Type", "image/png");
    res.send(user.avatar);
  } catch (e) {
    res.status(404).send();
  }
});

module.exports = router;
