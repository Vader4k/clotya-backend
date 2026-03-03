import express from 'express'
import cookieParser from 'cookie-parser'
import cors from 'cors'

const app = express()

//middlewares
app.use(express.json())
app.use(cookieParser())

app.use(cors({
    origin: ["http://localhost:3000", 'clotya-ccb1.vercel.app'],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    maxAge: 86400 // 24 hours
}))

//health check 
app.get("/", (req, res) => {
    res.json({ message: "API is running..." })
})

export default app
