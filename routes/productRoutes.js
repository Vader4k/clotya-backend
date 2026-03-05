import express from "express";
import { getAllProducts, getProduct, getProductsByCategory, getProductsBySubCategory, getProductsBySearch } from "../controllers/productController.js";

const router = express.Router();

router.get("/", getAllProducts);
router.get("/:slug", getProduct);
router.get("/category/:category", getProductsByCategory);
router.get("/sub-category/:subCategory", getProductsBySubCategory);
router.get("/search/:search", getProductsBySearch);

export default router;