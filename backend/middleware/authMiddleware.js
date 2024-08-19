import jwt from "jsonwebtoken";
import asyncHandler from "./asyncHandler.js";
import User from "../models/User.js";

// Protect routes
const protect = asyncHandler(async (req, res, next) => {
  let token;

  // Read the JWT from the cookie
  token = req.cookies.jwt;

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      //getting all the fields except the password
      req.user = await User.findById(decoded.userId).select("-password"); //this puts the logged in user data in the req.user

      next();
    } catch (error) {
      console.log(error);
      res.status(401);
      throw new Error("Not Authorized, Token Failed");
    }
  } else {
    res.status(401);
    throw new Error("Not Authorized, No Token");
  }
});

// Admin middleware
const admin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(401);
    throw new Error("Not Authorized As An Admin");
  }
};

export { protect, admin };
