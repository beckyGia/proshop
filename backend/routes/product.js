import express from "express";
import checkObjectId from "../middleware/checkObjectId.js";
const router = express.Router();
import { getProducts, getProductById } from "../controllers/product.js";

router.route("/").get(getProducts);
router.route("/:id").get(getProductById);

// Declare productRoutes and then export it
const productRoutes = router;

export default productRoutes;
