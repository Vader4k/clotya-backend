import express from 'express'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import authRoute from './routes/authRoute.js'
import productRoute from './routes/productRoutes.js'
import cartRoute from './routes/cartRoutes.js'
import categoryRoute from './routes/categoryRoutes.js'
import publicRoute from './routes/publicRoutes.js'

const app = express()

//middlewares
app.use(express.json())
app.use(cookieParser())

app.use(cors({
    origin: ["http://localhost:3000", 'https://clotya-ccb1.vercel.app'],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    maxAge: 86400 // 24 hours
}))

//health check 
app.get("/", (req, res) => {
    res.json({ message: "API is running..." })
})

// auth routes
app.use("/api/auth", authRoute)

// product routes
app.use("/api/products", productRoute)

// cart routes
app.use("/api/cart", cartRoute)

// category routes
app.use("/api/categories", categoryRoute)

// public routes
app.use("/api/public", publicRoute)

export default app
