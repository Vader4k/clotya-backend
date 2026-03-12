import express from "express";
import { getAllCategoriesPublic } from "../controllers/categoriesController.js";
import { getProductsByCategoryPublic } from "../controllers/productController.js";
const router = express.Router();

router.get("/categories", getAllCategoriesPublic);
router.get("/products/category/:category", getProductsByCategoryPublic);

export default router;
