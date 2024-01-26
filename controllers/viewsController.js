const Tour = require("./../models/tourModel");
const User = require("./../models/userModel");
const catchAsync = require("../utils/catchAsync");
const slugify = require("slugify");
const AppError = require("./../utils/appError");

exports.getOverview = catchAsync(async (req, res) => {
  //1) Get tour data from collection
  const tours = await Tour.find();
  //2)Build template

  //3)Render that template using tour data from 1)
  res.status(200).render("overview", {
    title: "All Tours",
    tours,
  });
});

exports.getTour = catchAsync(async (req, res, next) => {
  // // Fetch all tours from the database
  // const tours = await Tour.find();

  // //Loop through each tour
  // for (let tour of tours) {
  //   // Generate a slug for this tour
  //   tour.slug = slugify(tour.name, { lower: true });

  //   // Save the updated tour back to the database
  //   await tour.save();
  // }
  //1)Get the data for the requested tour (including reviews and guides)
  //console.log(Tour.)
  const tour = await Tour.findOne({ slug: req.params.slug }).populate({
    path: "reviews",
    fields: "review rating user",
  });
  console.log("tour not found");
  if (!tour) {
    return next(new AppError("There is no tour with that name", 404));
  }

  //2)Build the template
  //3)Render the template using data from 1)

  res.status(200).render("tour", {
    title: "The Forest Hiker tour",
    tour,
  });
});
exports.getLoginForm = (req, res, next) => {
  res.status(200).render("login", {
    title: "login page",
  });
};
exports.getAccount = (req, res, next) => {
  res.status(200).render("account", {
    title: "Your account",
  });
};
// exports.updateUserData = catchAsync(async (req, res, next) => {
//   const updatedUser = await User.findByIdAndUpdate(req.user.id,
//     {
//       name: req.body.name,
//       email: req.body.email,
//     },
//     {
//       new: true,
//       runValidators: true,
//     }
//   );
//   res.status(200).render('account',{
//     title:'Your account page',
//     user:updatedUser
//   })
// });
