const jwt = require("jsonwebtoken");
const User = require("../models/user");

const auth = async (req, res, next) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", "");
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // validating token

    /*We find correct user by validating 2 things here:
        1. ID from jwt payload must match with one in the document.
        2. The token sent in header must be part of token's array in document (when user logs out, we delete the token)
    */
    const user = await User.findOne({
      _id: decoded._id,
      "tokens.token": token
    }); // find associated user with that token
    if (!user) throw new Error();

    req.user = user;
    req.token = token; // This tells that which token to delete on log out
    next();
  } catch (err) {
    res.status(401).send({ error: "Please authenticate!" });
  }
};

module.exports = auth;
