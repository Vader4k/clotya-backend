import express from "express";
import { getAllCategoriesPublic } from "../controllers/categoriesController.js";
import { getProductsByCategoryPublic, getBestSellerProducts, getProductBySlugPublic, getRelatedProducts, getProductsBySearch, getAllProductsPublic } from "../controllers/productController.js";
const router = express.Router();

router.get("/categories", getAllCategoriesPublic);
router.get("/products/category/:category", getProductsByCategoryPublic);
router.get("/products/best-seller", getBestSellerProducts);
router.get("/products/related/:id", getRelatedProducts);
router.get("/products/search/:search", getProductsBySearch);
router.get("/products/:slug", getProductBySlugPublic);
router.get("/products", getAllProductsPublic);


export default router;
