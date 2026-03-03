import mongoose from "mongoose";

const cartItemSchema = new mongoose.Schema({
    sku: String,
    quantity: Number,
    size: String
})

const cartSchema = new mongoose.Schema(
    {
        cartId: {
            type: String,
            required: true,
            unique: true
        },
        items: [cartItemSchema]
    },
    { timestamps: true }
)

export const Cart = mongoose.model("Cart", cartSchema);