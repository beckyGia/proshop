import jwt from "jsonwebtoken";

const generateToken = (res, userId) => {
  //sign creates the token
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });

  // Set JWT HTTP-Only Cookie
  res.cookie("jwt", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV !== "development",
    sameSite: "strict", //prevents attacks
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 Days when do we want it to expire
  });
};

export default generateToken;
