const express = require('express');
const router = express.Router({mergeParams:true});
const wrapAsync = require("../utils/wrapAsync.js")
const Review = require('../models/review.js')
const Listing = require('../models/listing.js')
const {validateReview, isLoggedIn, isreviewAuthor} = require("../middleware.js")
//Post Reviews
router.post("/",isLoggedIn, async(req,res) => {
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.reviews);
    newReview.author = req.user._id;
    listing.reviews.push(newReview)
  
    await newReview.save()
    await listing.save()
    console.log("new review saved")
    res.redirect(`/listings/${listing.id}`)
  })
  
  //Post Reviews Delete
  router.delete("/:reviewId",isLoggedIn,isreviewAuthor, async(req,res) => {
    let {id,reviewId} = req.params;
    await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}})
    await Review.findByIdAndDelete(reviewId)
    res.redirect(`/listings/${id}`)
  })

  module.exports = router;