const express = require('express')
require('dotenv').config();
const errorHandler = require('./middlewares/globalErrorHandler')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const helmet = require('helmet') 
// routes
const authRoute = require('./routes/authRoute')
const userRoute = require('./routes/userRoute')
const app = express()

const connectDB = require('./config/connectDB')

connectDB()

// Helmet
app.use(helmet());

// Cookie parser
app.use(cookieParser())

// allow the express server to process POST request rendered by the ejs files 
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
// Use routes localhost:4000/api/v1/
app.use("/api/v1/auth", authRoute)
app.use("/api/v1/users", userRoute)

app.use("/", (req, res) => {
    res.send("Server side rendering...")
})

// Error handler
app.use(errorHandler)

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
