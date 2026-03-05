import express from "express";
import { getAllCategories, addCategory, updateCategory, deleteCategory } from "../controllers/categoriesController.js";
import { admin } from "../middleware/admin.middleware.js";
import { protect } from "../middleware/verify-token.middleware.js";

const router = express.Router();

router.get("/", getAllCategories);
router.post("/", protect, admin, addCategory);
router.put("/:id", protect, admin, updateCategory);
router.delete("/:id", protect, admin, deleteCategory);

export default router;