import jwt from 'jsonwebtoken'
import user from '../models/user.js'

export const protect = async (req, res, next) => {
    let token = req.cookies.token || req.headers.authorization?.split(" ")[1]

    if(!token){
        return res.status(401).json({message: "Unauthorized"})
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        req.user = await user.findById(decoded.id).select("-password")
        next()
    } catch (error) {
        return res.status(401).json({message: "Token invalid or expired"})
    }
}