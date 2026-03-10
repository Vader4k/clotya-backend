import { Category } from "../models/category.model.js";

export const getAllCategories = async (req, res) => {
    try {
        const categories = await Category.aggregate([
            {
                $lookup: {
                    from: "products",
                    localField: "_id",
                    foreignField: "category",
                    as: "categoryProducts"
                }
            },
            {
                $addFields: {
                    items: { $size: "$categoryProducts" }
                }
            },
            {
                $project: {
                    categoryProducts: 0
                }
            }
        ]);

        if (!categories || categories.length === 0) {
            return res.status(404).json({ message: "No categories found" });
        }

        res.status(200).json({
            success: true,
            message: "Categories fetched successfully",
            categories
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const addCategory = async (req, res) => {
    try {
        const { name, slug, description, isActive } = req.body;
        const category = await Category.create({ name, slug, description, isActive });
        res.status(201).json({
            success: true,
            message: "Category added successfully",
            category
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const updateCategory = async (req, res) => {
    try {
        const { name, slug, description, isActive } = req.body;
        const category = await Category.findByIdAndUpdate(req.params.id, { name, slug, description, isActive }, { new: true });
        res.status(200).json({
            success: true,
            message: "Category updated successfully",
            category
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const deleteCategory = async (req, res) => {
    try {
        const category = await Category.findByIdAndDelete(req.params.id);
        res.status(200).json({
            success: true,
            message: "Category deleted successfully",
            category
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}