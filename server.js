const express = require("express");
require('dotenv').config();
const cors = require("cors");
const connectDB = require("./config/db");
const transactionRoutes = require("./routes/transactionRoutes")
const authRoutes = require('./routes/authRoutes');
const { protect } = require("./middleware/authMiddleware");

dotenv.config()

const app = express()

//middleware 
app.use(express.json())
app.use(cors())

// connect to db
connectDB()

// routes 
app.get("/", (req, res) =>{
    res.send('api is running')
})

// auth api routes
app.use("/api/auth", authRoutes)

// transactions api routes
app.use('/api/transactions', protect, transactionRoutes)

const PORT = process.env.PORT || 5000;

app.listen(PORT,()=>{
    console.log(`server running on port ${PORT}`)
})