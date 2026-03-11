import express from "express";
import { getAllCategories } from "../controllers/categoriesController.js";
const router = express.Router();

router.get("/categories", getAllCategories);

export default router;
