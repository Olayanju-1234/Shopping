
const { StatusCodes } = require('http-status-codes');



const errorHandler = (err,req,res,next) =>{

    let customError = {
        statuscode:err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
        msg: err.message || 'Something went wrong, please try again'
        
    }
    console.log(err)

    // validation error (check for err.name === validationError)
    if(err.name === 'ValidationError'){
        customError.msg = Object.values(err.errors).map((item) => item.message).join(',');
        customError.statuscode = 400;
    }

    // duplicate error (check for err.code === 11000)
    if(err.code === 11000){
        customError.msg = `Duplicate value entered for ${Object.keys(err.keyValue)} field, please pick another value`;
        customError.statuscode = 400;
    }

    // cast error (check for err.name === castError)
    if(err.name === 'CastError'){
        customError.msg = `No item found with such id`;
        customError.statuscode = 404;
    }


    return res.status(customError.statuscode).json({success: false, msg: customError.msg});
    
}

module.exports = errorHandler;