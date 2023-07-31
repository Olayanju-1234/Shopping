const express = require('express')
require('dotenv').config();
const errorHandler = require('./middlewares/globalErrorHandler')
const cookieParser = require('cookie-parser')
const morgan = require('morgan');
const bodyParser = require('body-parser')
const helmet = require('helmet') 
const cors = require('cors')
// routes
const authRoute = require('./routes/authRoute')
const userRoute = require('./routes/userRoute')
const productRoute = require('./routes/productRoute')
const blogRoute = require('./routes/blogRoute')
const productCategoryRoute = require('./routes/productCategoryRoute')
const blogCategoryRoute = require('./routes/blogCategoryRoute')
const brandRoute = require('./routes/brandRoute')
const couponRoute = require('./routes/couponRoute')

const app = express()

const connectDB = require('./config/connectDB')
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
  
// Use routes localhost:4000/api/v1/
app.use("/api/v1/auth", authRoute)
app.use("/api/v1/users", userRoute)
app.use("/api/v1/products", productRoute)
app.use("/api/v1/blogs", blogRoute)
app.use("/api/v1/product-categories", productCategoryRoute)
app.use("/api/v1/blog-categories", blogCategoryRoute)
app.use("/api/v1/brands", brandRoute)
app.use("/api/v1/coupons", couponRoute)


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