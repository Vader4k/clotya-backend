import express from "express";
import {
    getAllProducts,
    getProduct,
    getProductsByCategory,
    getProductsBySubCategory,
    getProductsBySearch,
    addProduct,
    updateProduct,
    deleteProduct
} from "../controllers/productController.js";
import { protect, admin } from "../middleware/verify-token.middleware.js";

const router = express.Router();

router.get("/", getAllProducts);
router.get("/:slug", getProduct);
router.get("/category/:category", getProductsByCategory);
router.get("/sub-category/:subCategory", getProductsBySubCategory);
router.get("/search/:search", getProductsBySearch);
router.post("/", protect, admin, addProduct);
router.put("/:id", protect, admin, updateProduct);
router.delete("/:id", protect, admin, deleteProduct);

export default router;