import express from "express";
import {
    getAllProducts,
    getProductBySlug,
    getProductsByCategory,
    getProductsBySearch,
    addProduct,
    updateProduct,
    deleteProduct
} from "../controllers/productController.js";
import { protect } from "../middleware/verify-token.middleware.js";
import { admin } from "../middleware/admin.middleware.js";

const router = express.Router();

router.get("/", protect, admin, getAllProducts);
router.get("/:slug", protect, admin, getProductBySlug);
router.get("/category/:category", protect, admin, getProductsByCategory);
router.get("/search/:search", protect, admin, getProductsBySearch);
router.post("/", protect, admin, addProduct);
router.put("/:id", protect, admin, updateProduct);
router.delete("/:id", protect, admin, deleteProduct);

export default router;