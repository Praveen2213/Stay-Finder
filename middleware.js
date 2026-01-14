const Listing = require("./models/listing");
const Review = require("./models/review");
const {
  listingSchema,
  reviewSchema,
  userSignupSchema,
  userLoginSchema,
} = require("./schema.js");
const ExpressError = require("./utils/ExpressError.js");

module.exports.isLoggedIn = (req, res, next) => {
  // console.log(req);
  if (!req.isAuthenticated()) {
    //a built in method by passport to check for logged in
    req.session.redirectUrl = req.originalUrl.replace("/reviews", ""); //We store req.originalUrl inside object req.session by creating a key redirectUrl because the req.original changes after redirecting to login.
    req.flash("error", "You must be logged in!");
    return res.redirect("/login"); //login first
  }
  next();
};

//below middleware is only created to protect originalUrl saved in redirect
//because after login done passport delete the redirectUrl
module.exports.saveRedirectUrl = (req, res, next) => {
  if (req.session.redirectUrl) {
    res.locals.redirectUrl = req.session.redirectUrl;
  }
  next();
};

//request validation for deleting/editing/updating a listing by checking if the user is the owner
module.exports.isOwner = async (req, res, next) => {
  let { id } = req.params;
  let listing = await Listing.findById(id);
  if (!listing.owner._id.equals(res.locals.currUser._id)) {
    req.flash("error", "You are not the owner of this listing");
    return res.redirect(`/listings/${id}`);
  }
  next();
};

//validating listings with joi
module.exports.validateListing = (req, res, next) => {
  if (!req.body || Object.keys(req.body).length === 0) {
    //req.body is empty
    throw new ExpressError(400, "Request body cannot be empty");
  }
  let { error } = listingSchema.validate(req.body);
  if (error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};

//validating listings with joi
module.exports.validateReview = (req, res, next) => {
  if (!req.body || Object.keys(req.body).length === 0) {
    //req.body is empty
    throw new ExpressError(400, "Request body cannot be empty");
  }
  let { error } = reviewSchema.validate(req.body); //
  if (error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};

//request validation for singup
module.exports.validateSingup = (req, res, next) => {
  if (!req.body || Object.keys(req.body).length === 0) {
    //req.body is empty
    throw new ExpressError(400, "Request body cannot be empty");
  }
  let { error } = userSignupSchema.validate(req.body);
  if (error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};

//request validation for login
module.exports.validateLogin = (req, res, next) => {
  if (!req.body || Object.keys(req.body).length === 0) {
    //req.body is empty
    throw new ExpressError(400, "Request body cannot be empty");
  }
  let { error } = userLoginSchema.validate(req.body);
  if (error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};

//request validation for deleting a review by checking if the user is the author
module.exports.isReviewAuthor = async (req, res, next) => {
  let { id, reviewId } = req.params;
  let review = await Review.findById(reviewId);
  if (!review.author.equals(res.locals.currUser._id)) {
    req.flash("error", "You are not the author of this review");
    return res.redirect(`/listings/${id}`);
  }
  next();
};
