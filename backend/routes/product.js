import express from "express";
const router = express.Router();
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
} from "../controllers/product.js";
import { protect, admin } from "../middleware/authMiddleware.js";
import checkObjectId from "../middleware/checkObjectId.js";

router.route("/").get(getProducts).post(protect, admin, createProduct);
router
  .route("/:id")
  .get(checkObjectId, getProductById)
  .put(protect, admin, checkObjectId, updateProduct);

// Declare productRoutes and then export it
const productRoutes = router;

export default productRoutes;
