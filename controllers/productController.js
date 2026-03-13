import { Product } from "../models/product.model.js";
import { Category } from "../models/category.model.js";
import { uploadToCloudinary, deleteFromCloudinary } from "../utils/cloudinary.js";

export const getAllProducts = async (req, res) => {
    try {
        const {
            page = 1,
            limit = 10,
            tags,
            minPrice,
            maxPrice,
            sizes,
            colors,
            sort
        } = req.query;

        const query = {};

        // Filtering by tags (comma separated string)
        if (tags) {
            query.tags = { $in: tags.split(",") };
        }

        // Filtering by price range
        if (minPrice || maxPrice) {
            query.price = {};
            if (minPrice) query.price.$gte = Number(minPrice);
            if (maxPrice) query.price.$lte = Number(maxPrice);
        }

        // Filtering by sizes (comma separated string)
        if (sizes) {
            query["inventory.size"] = { $in: sizes.split(",") };
        }

        // Filtering by colors (comma separated string)
        if (colors) {
            query["colors.name"] = { $in: colors.split(",") };
        }

        // Building sorting options
        let sortOption = { createdAt: -1 }; // default sorting
        if (sort === 'price_asc') sortOption = { price: 1 };
        if (sort === 'price_desc') sortOption = { price: -1 };
        if (sort === 'newest') sortOption = { createdAt: -1 };
        if (sort === 'sold') sortOption = { sold: -1 };

        const skip = (Number(page) - 1) * Number(limit);

        const products = await Product.find(query)
            .sort(sortOption)
            .skip(skip)
            .limit(Number(limit));

        const totalProducts = await Product.countDocuments(query);

        res.status(200).json({
            success: true,
            message: "Products fetched successfully",
            products,
            pagination: {
                totalProducts,
                currentPage: Number(page),
                totalPages: Math.ceil(totalProducts / Number(limit)),
                limit: Number(limit)
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

export const getProductBySlug = async (req, res) => {
    try {
        const product = await Product.findOne({ slug: req.params.slug });
        if (!product) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }
        res.status(200).json({
            success: true,
            message: "Product fetched successfully",
            product
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

export const getProductsByCategory = async (req, res) => {
    try {
        const categoryParam = req.params.category;
        
        if (!categoryParam.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(404).json({ success: false, message: "Category not found" });
        }

        const category = await Category.findById(categoryParam);
        if (!category) {
            return res.status(404).json({ success: false, message: "Category not found" });
        }

        const products = await Product.find({ category: category._id });
        if (!products || products.length === 0) {
            return res.status(200).json({ success: true, message: "No products found for this category", products: [] });
        }
        res.status(200).json({
            success: true,
            message: "Products fetched successfully",
            products
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

export const getProductsByCategoryPublic = async (req, res) => {
    try {
        const categoryParam = req.params.category;
        
        let category = await Category.findOne({ slug: categoryParam });

        if (!category) {
            return res.status(404).json({ success: false, message: "Category not found" });
        }

        const products = await Product.find({ category: category._id });
        if (!products || products.length === 0) {
            return res.status(200).json({ success: true, message: "No products found for this category", products: [] });
        }
        res.status(200).json({
            success: true,
            message: "Products fetched successfully",
            products
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

export const getProductsBySearch = async (req, res) => {
    try {
        const products = await Product.find({ $text: { $search: req.params.search } });
        if (!products) {
            return res.status(404).json({ success: false, message: "No products found" });
        }
        res.status(200).json({
            success: true,
            message: "Products fetched successfully",
            products
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

export const addProduct = async (req, res) => {
    try {
        const { images, image, ...productData } = req.body;
        let imageUrls = [];

        // Handle multiple images
        if (images && Array.isArray(images)) {
            for (const img of images) {
                const uploadedUrl = await uploadToCloudinary(img, 'clotya');
                if (uploadedUrl) imageUrls.push(uploadedUrl);
            }
        } 
        // Handle single image
        else if (image) {
            const uploadedUrl = await uploadToCloudinary(image, 'clotya');
            if (uploadedUrl) imageUrls.push(uploadedUrl);
        }

        const product = new Product({
            ...productData,
            images: imageUrls
        });

        await product.save();
        res.status(201).json({
            success: true,
            message: "Product added successfully",
            product
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

export const updateProduct = async (req, res) => {
    try {
        const { images, image, ...updateData } = req.body;
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }

        let newImageUrls = [...(product.images || [])];

        // Handle image updates
        if (images && Array.isArray(images)) {
            const uploadedUrls = [];
            for (const img of images) {
                if (typeof img === 'string' && img.startsWith('data:')) {
                    const uploadedUrl = await uploadToCloudinary(img, 'clotya');
                    if (uploadedUrl) uploadedUrls.push(uploadedUrl);
                } else if (typeof img === 'string' && img.startsWith('http')) {
                    uploadedUrls.push(img);
                }
            }

            // identify images to delete from Cloudinary
            const imagesToDelete = product.images.filter(url => !uploadedUrls.includes(url));
            for (const url of imagesToDelete) {
                await deleteFromCloudinary(url);
            }

            newImageUrls = uploadedUrls;
        } else if (image && typeof image === 'string' && image.startsWith('data:')) {
            // If a single new image is provided, replace all old ones
            for (const url of product.images) {
                await deleteFromCloudinary(url);
            }
            const uploadedUrl = await uploadToCloudinary(image, 'clotya');
            newImageUrls = uploadedUrl ? [uploadedUrl] : [];
        }

        const updatedProduct = await Product.findByIdAndUpdate(
            req.params.id,
            { ...updateData, images: newImageUrls },
            { new: true }
        );

        res.status(200).json({
            success: true,
            message: "Product updated successfully",
            product: updatedProduct
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

export const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        
        if (!product) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }

        // Delete images from Cloudinary
        if (product.images && product.images.length > 0) {
            for (const url of product.images) {
                await deleteFromCloudinary(url);
            }
        }

        await Product.findByIdAndDelete(req.params.id);

        res.status(200).json({
            success: true,
            message: "Product deleted successfully",
            product
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}