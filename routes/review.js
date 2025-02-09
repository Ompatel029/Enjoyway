const express = require('express');
const router = express.Router({mergeParams:true});
const wrapAsync = require("../utils/wrapAsync.js")
const Review = require('../models/review.js')
const Listing = require('../models/listing.js')
const {validateReview, isLoggedIn, isreviewAuthor} = require("../middleware.js")
const reviewController = require("../controllers/reviews.js")

//Post Reviews
router.post("/",isLoggedIn, reviewController.createReview)
  
  //Post Reviews Delete
router.delete("/:reviewId",isLoggedIn,isreviewAuthor, reviewController.deleteReview)

  module.exports = router;