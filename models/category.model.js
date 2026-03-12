import mongoose from "mongoose";

const tagSchema = new mongoose.Schema({
    name: { type: String }
});

const categorySchema = new mongoose.Schema(
    {
        name: { type: String, required: true, unique: true },
        slug: { type: String, required: true, unique: true },
        description: { type: String, require: true },
        isActive: { type: Boolean, default: true },
        items: { type: Number, default: 0 },
        tags: { type: [tagSchema], default: [] },
    },
    { timestamps: true }
)

export const Category = mongoose.model("Category", categorySchema);