import { Cart } from "../models/cart.model.js";

export const addToCart = async (req, res) => {
    try {
        const { productId, sku, quantity, size } = req.body;
        let cart

        //logged in user
        if (req.user) {
            cart = await Cart.findOne({ user: req.user._id })
        } else {
            cart = await Cart.findOne({ cartId: req.cartId })
        }

        //if no cart
        if (!cart) {
            cart = await Cart.create({
                user: req.user?._id || null,
                cartId: req.user ? null : req.cartId,
                items: []
            })
        }

        // check if item already exits in cart
        const existingItem = cart.items.find(item => item.sku === sku && item.product.toString() === productId && item.size === size)

        if (existingItem) {
            existingItem.quantity += quantity
        } else {
            cart.items.push({
                product: productId,
                sku,
                quantity,
                size
            })
        }

        await cart.save()

        res.status(200).json({
            success: true,
            message: "Item added to cart",
            cart
        })

    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            message: "server error",
            error: error.message
        })
    }
}