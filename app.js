const express = require('express')
require('dotenv').config();
const errorHandler = require('./src/api/Middlewares/globalErrorHandler')
const cookieParser = require('cookie-parser')
const morgan = require('morgan');
const bodyParser = require('body-parser')
const helmet = require('helmet') 
const cors = require('cors')
const apiRoutes = require('./src/api/components/index')


const app = express()

const connectDB = require('./src/config/connectDB')
connectDB()

app.use(cors())
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser())
app.use(morgan('dev'));
app.use(errorHandler)
app.use('/api/v1', apiRoutes)
  
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