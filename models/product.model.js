import mongoose from "mongoose";

const inventorySchema = new mongoose.Schema({
    size: { type: String, required: true },
    quantity: { type: Number, required: true }
})

const colorSchema = new mongoose.Schema({
    name: String,
    hex: String
})

const productSchema = new mongoose.Schema(
    {
        slug: { type: String, unique: true, require: true },
        sku: { type: String, unique: true, require: true },

        name: { type: String, require: true, require: true },

        tags: [String],

        description: { type: String, require: true },
        shortDescription: { type: String, require: true },

        price: { type: Number, require: true },
        discountPrice: { type: Number, default: null },
        discountPercentage: { type: Number, default: null },

        images: [String],

        isBestSeller: { type: Boolean, default: false },
        isFeatured: { type: Boolean, default: false },
        isNewArrival: { type: Boolean, default: false },
        isTrending: { type: Boolean, default: false },
        sold: { type: Number, default: 0 },

        inventory: [inventorySchema],
        colors: [colorSchema],

        rating: {
            average: { type: Number, default: 0 },
            count: { type: Number, default: 0 }
        },

        category: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },

    },
    { timestamps: true }
)

productSchema.index({ category: 1, price: 1, slug: 1, name: 1, colors: 1, tags: 1, isBestSeller: 1, isFeatured: 1, isNewArrival: 1, isTrending: 1, sold: 1 })

export const Product = mongoose.model("Product", productSchema);