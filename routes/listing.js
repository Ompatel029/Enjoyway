const express = require('express');                                 
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js")
const Listing = require('../models/listing.js')
const {isLoggedIn, isOwner, validateListing} = require("../middleware.js")

//index Route
router.get('/',wrapAsync(async (req,res) => {
    const allListing =  await Listing.find({})
    res.render("./listings/index.ejs",{allListing})
    }))
 //new Route
router.get("/new", isLoggedIn,(req,res)=>{
    res.render("./listings/new.ejs")
})
//show route
router.get("/:id",wrapAsync(async(req,res) =>{
    let {id} = req.params;
    const listing = await Listing.findById(id)
     .populate({
        path:"reviews",
        populate:{
         path:"author",
         select:"username"
        }
       })
       .populate("owner")
    if(!listing){
        req.flash("error","Cannot find that listing!")
        res.redirect("/listings")
    }
    res.render("./listings/show.ejs",{listing})
}))

//Create Route
router.post("/",isLoggedIn, wrapAsync(async(req,res,next)=>{
        const newListing = new Listing(req.body.listing); 
        newListing.owner = req.user._id;
        await newListing.save(); 
        req.flash("success","New Listing Created!") 
        res.redirect("/listings")   
}))

//Edit Route
router.get("/:id/edit",isLoggedIn,isOwner,validateListing,wrapAsync(async(req,res) =>{
    let{id} = req.params;
    const listing = await Listing.findById(id);
    res.render("./listings/edit.ejs",{listing})
}))
//update route
router.put("/:id",isLoggedIn,isOwner,validateListing,wrapAsync(async(req,res) => {
    let{id} = req.params;
    let listing = Listing.findById(id);
    if(!listing.owner.eqauals(currentUser._id)){
         req.flash("error","You do not have permission edit!")
         res.redirect(`/listings/${id}`)
    }
    await Listing.findByIdAndUpdate(id,{...req.body.listing})
    req.flash("success","Listing updated!") 
    res.redirect(`/listings/${id}`)
}))
//Delete route
router.delete("/:id",isLoggedIn, isOwner,validateListing,wrapAsync(async(req,res) =>{
    let {id} = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing)
    req.flash("success","Listing Deleted!") 
    res.redirect('/listings');
}))


module.exports = router;