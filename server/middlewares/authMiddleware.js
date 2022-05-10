const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const jwt = require("jsonwebtoken");

const protect = asyncHandler(async (req, res, next) => {
  // Check for token

  if (req.headers.authorization) {
    const token = req.headers.authorization.split(" ")[1]; // Bearer token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded) {
      const user = await User.findById(decoded.id);
      if (user) {
        req.user = user;
        next();
      } else {
        res.status(403);
        throw new Error("Unauthorized, user not found");
      }
    } else {
      res.status(403);
      throw new Error("Unauthorized, invalid jwt");
    }
  } else {
    res.status(403);
    throw new Error("Unauthorized, no token");
  }
});

module.exports = { protect };
