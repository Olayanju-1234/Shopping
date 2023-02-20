const express = require('express')
require('dotenv').config();
const errorHandler = require('./middlewares/globalErrorHandler')

// routes
const authRoute = require('./routes/authRoute')
const app = express()

const connectDB = require('./config/connectDB')

connectDB()

app.use(express.json())

// Error handler
app.use(errorHandler)

// Use routes
app.use("/api/v1/auth", authRoute)

app.use("/", (req, res) => {
    res.send("Server side rendering...")
})

const port = process.env.PORT || 5000;
const start = async() =>{
    try {
        await connectDB();
        app.listen(port, () =>{
            console.log(`server have started on port ${port}!!! `)
        })
    } catch (error) {
        console.log(error);
    }
}

start();
