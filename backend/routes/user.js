import express from "express";
const router = express.Router();
import {
  loginUser,
  registerUser,
  logoutUser,
  getUserProfile,
  updateUserProfile,
  getUsers,
  deleteUser,
  getUserByID,
  updateUser,
} from "../controllers/user.js";
import { protect, admin } from "../middleware/authMiddleware.js";

//route is used when you have different methods on the same route
router.route("/").post(registerUser).get(protect, admin, getUsers);
router.post("/logout", logoutUser);
router.post("/login", loginUser);
router
  .route("/profile")
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);
router
  .route("/:id")
  .get(protect, admin, getUserByID)
  .put(protect, admin, updateUser)
  .delete(protect, admin, deleteUser);

// Declare userRoutes and then export it
const userRoutes = router;

export default userRoutes;
