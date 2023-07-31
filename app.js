
require('dotenv').config();
require('express-async-errors');

const express = require('express')
const morgan = require('morgan');
const cookieParser = require('cookie-parser')
const helmet = require('helmet') 
const cors = require('cors')

const app = express()

const apiRoutes = require('./src/api/components/index')
const connectDB = require('./Config/connectDB')
const errorHandler = require('./src/api/Middlewares/globalErrorHandler')


app.use(express.json())
app.use(cors())
app.use(helmet());
app.use(cookieParser(process.env.COOKIE_SECRET))
app.use(morgan('dev'));
app.use('/api/v1', apiRoutes)
  
app.use("/", (req, res) => {
    res.send("Server side rendering...")
})

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