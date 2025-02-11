const Listing = require("../models/listing.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });



module.exports.index = (async (req, res) => {
    const allListing = await Listing.find({});
    res.render("./listings/index.ejs", { allListing });
});

module.exports.renderNewForm = (req, res) => {
    res.render("./listings/new.ejs");
};

module.exports.showListing = (async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id)
        .populate({
            path: "reviews",
            populate: {
                path: "author",
                select: "username"
            }
        })
        .populate("owner");
    
    if (!listing) {
        req.flash("error", "Cannot find that listing!");
        return res.redirect("/listings");
    }
    res.render("./listings/show.ejs", { listing });
});

module.exports.createListing = (async (req, res) => {
      let response = await geocodingClient
      .forwardGeocode({
        query: req.body.listing.location,
        limit: 1,
      })
        .send()
        
    let url = req.file.path;
    let filename = req.file.filename;

    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = {url, filename};
    newListing.geometry = response.body.features[0].geometry;
    let saveListing = await newListing.save();
    console.log(saveListing);
    
    req.flash("success", "New Listing Created!");
    res.redirect("/listings");
});

module.exports.renderEditForm = (async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "Cannot find that listing!");
        return res.redirect("/listings");
    }

    let OriginalImageUrl = listing.image.url;
    OriginalImageUrl = listing.image.url.replace(/w=\d+/, "w=250").replace(/h=\d+/, "h=100");
    console.log("Transformed URL:", OriginalImageUrl);
    res.render("./listings/edit.ejs", { listing ,OriginalImageUrl});
});

module.exports.updateListing =(async (req, res) => {
    let { id } = req.params;
    let listing=await Listing.findByIdAndUpdate(id, { ...req.body.listing });
 
    if(typeof req.file !== "undefined"){
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = { url,filename};
    await listing.save();
    }
    req.flash("success", "Listing updated!");
    res.redirect(`/listings/${id}`);
});

module.exports.deleteListing = (async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing Deleted!");
    res.redirect("/listings");
});

module.exports.filterListings = async (req, res) => {
    const { category } = req.params;
    try {
      let filteredListings;
      if (category === "trending") {
        // For trending, show listings with highest ratings/reviews
        filteredListings = await Listing.find({})
          .sort({ reviews: -1 })
          .limit(10);
      } else {
        filteredListings = await Listing.find({ category });
      }
      res.render("listings/index", { allListing: filteredListings });
    } catch (error) {
      req.flash("error", "Error filtering listings");
      res.redirect("/listings");
    }
  };