/*eslint-disable*/
//@ts-ignore
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const Tour = require("./../models/tourModel");
const factory = require("./handlerFactory");
const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");
const slugify=require('slugify');

exports.getCheckOutSession = async (req, res, next) => {

  //1)Get the currently booked tour
  const tour = await Tour.findById(req.params.tourId);

  //2)Create checkout session
  const products=await stripe.products.create({
    name: `${tour.name} Tour`,
    description:tour.summary,
    images:[`https://www.natours.dev/img/tours/${tour.imageCover}`]
  })
  const price = await stripe.prices.create({
    currency: 'usd',
    unit_amount: 999*100,
    product:products.id,
    // product_data:{
    //   name:'The forest hiker',
    //   //description:tour.summary
    // }
  });
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    success_url: `${req.protocol}://${req.get("host")}/tour/${tour.slug}`,
    customer_email: req.user.email,
    client_reference_id: req.params.tourId,
    line_items: [
      {
        //name: `${tour.name} Tour`,
        //description: tour.summary,
        //images: [`https://www.natours.dev/img/tours/${tour.imageCover}`],
        // price: tour.price * 100,
        price:price.id,
        //price_data: "usd",
        quantity: 1,
      },
    ],
    mode:'payment'
  });

  //3)Create session as response
  res.status(200).json({
    status: "success",
    session,
  });
};
