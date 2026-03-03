import { v4 as uuidv4 } from "uuid";

export const attachCartId = (req, res, next) => {
    if (!req.cookies.cartId) {
        const newCartId = uuidv4()

        res.cookie("cartId", newCartId, {
            httpOnly: true,
            maxAge: 60 * 60 * 24 * 30 * 1000,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax"
        })
        req.cartId = newCartId
    } else {
        req.cartId = req.cookies.cartId
    }
    next()
}