import { User } from '../models/user.js'
import { hashPassword, comparePassword } from '../utils/utils.js'
import jwt from 'jsonwebtoken'

export const registerUser = async (req, res) => {
    try {
        const { name, email, password, role } = req.body

        //check if user exists
        const existingUser = await User.findOne({ email })
        if (existingUser) {
            return res.status(400).json({ message: "user already exits" })
        }

        //hash password
        const hashedPassword = await hashPassword(password)

        //create new user
        const user = new User({
            name,
            email,
            password: hashedPassword,
            role
        })

        //TODO: generate email to notify user of account creation

        //save user
        await user.save()

        res.status(201).json({ message: "user registered successfully" })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "internal server error" })
    }
}

export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body

        //check if user exists
        const user = await User.findOne({ email })
        if (!user) {
            return res.status(404).json({ message: "user not found" })
        }

        //check password
        const isPasswordValid = await comparePassword(password, user.password)
        if (!isPasswordValid) {
            return res.status(401).json({ message: "invalid credentials" })
        }

        //generate token
        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        )

        //set http only cookie
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000
        })

        // Send user info (excluding password) if needed by the frontend
        const { password: _, ...userWithoutPassword } = user.toObject()

        res.status(200).json({
            message: "user logged in successfully",
            user: userWithoutPassword
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "internal server error" })
    }
}