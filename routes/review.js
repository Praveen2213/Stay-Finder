const express = require("express");
const router = express.Router({ mergeParams: true }); //mergeParams lets a child router access URL params defined in a parent router eg:/listings/:id/reviews
const wrapAsync = require("../utils/wrapAsync.js");
const { validateReview, isLoggedIn, isReviewAuthor } = require("../middleware.js");

const reviewController = require("../controllers/reviews.js")

//post route for reviews
router.post("/", 
    isLoggedIn, 
    validateReview, 
    wrapAsync(reviewController.postReview)
);

//delete route for review
router.delete(
    "/:reviewId",
    isLoggedIn,
    isReviewAuthor,
    wrapAsync(reviewController.deleteReview)
);

module.exports = router;