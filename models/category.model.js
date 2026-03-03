import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
    {
        name: { type: String, require: true, unique: true },
        slug: { type: String, require: true, unique: true },
        description: { type: String, require: true },
        isActive: { type: Boolean, default: true },
},
    { timestamps: true }
)

export const Category = mongoose.model("Category", categorySchema);