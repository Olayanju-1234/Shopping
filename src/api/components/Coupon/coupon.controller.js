const Coupon = require('./coupon.model');
const { StatusCodes } = require('http-status-codes');
const { NotFoundError } = require('../../../errors');

// Create Coupon
const createCoupon = async (req, res) => {
  const newCoupon = await Coupon.create(req.body);
  res.status(StatusCodes.CREATED).json({
    message: 'Coupon created',
    newCoupon,
  });
};

const getAllCoupons = async (req, res) => {
  const coupons = await Coupon.find({});
  res.status(StatusCodes.OK).json({
    message: 'Coupons found',
    coupons,
  });
};

const updateCoupons = async (req, res) => {
  const { id } = req.params;

  const coupons = await Coupon.findByIdAndUpdate(
    id,
    {
      $set: req.body,
    },
    { new: true }
  );
  res.status(StatusCodes.OK).json({
    success: true,
    coupons,
  });
};

const deleteCoupon = async (req, res) => {
  const { id } = req.params;
  const coupon = await Coupon.findById(id);
  if (!coupon) {
    throw new NotFoundError('Coupon not in DB');
  }
  await coupon.remove();
  res.status(StatusCodes.OK).json({
    success: true,
    message: 'coupon deleted',
  });
};

module.exports = {
  createCoupon,
  getAllCoupons,
  updateCoupons,
  deleteCoupon,
};
