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
            return res.status(200).json({ message: "No categories found", categories: [] });
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

export const getAllCategoriesPublic = async (req, res) => {
    try {
        const categories = await Category.aggregate([
            {
                $match: { isActive: true }
            },
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
                    name: 1,
                    slug: 1,
                    items: 1,
                    description: 1,
                    tags: 1,
                    isActive: 1
                }
            }
        ]);

        if (!categories || categories.length === 0) {
            return res.status(200).json({ message: "No categories found", categories: [] });
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

export const getCategoryTags = async (req, res) => {
    try {
        const category = await Category.findById(req.params.id).select("tags name");
        if (!category) {
            return res.status(404).json({ success: false, message: "Category not found" });
        }
        res.status(200).json({
            success: true,
            message: "Tags fetched successfully",
            tags: category.tags
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const addCategory = async (req, res) => {
    try {
        const { name, slug, description, isActive, tags } = req.body;
        const category = await Category.create({ name, slug, description, isActive, tags });
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
        const { name, slug, description, isActive, tags } = req.body;
        const category = await Category.findByIdAndUpdate(req.params.id, { name, slug, description, isActive, tags }, { new: true });
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

export const deleteCategoryTags = async (req, res) => {
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