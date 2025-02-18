const express = require("express");
const router = express.Router();
const listings = require("../controllers/listings");
const wrapAsync = require("../utils/wrapAsync.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
const multer = require("multer");
const {storage} = require("../cloudConfig.js")
const upload = multer({ storage });
const listingController = require("../controllers/listings.js")
router.get("/new", isLoggedIn, listings.renderNewForm);


// Index Route
router.route("/")
    .get(listings.index)
    .post(isLoggedIn,upload.single("listing[image]"),wrapAsync(listingController.createListing)
) 

router.route("/:id")
    .get(wrapAsync(listings.showListing))  // Show Route
    .put(isLoggedIn,isOwner,upload.single("listing[image]"), wrapAsync(listings.updateListing))  // Update Route
    .delete(isLoggedIn, isOwner, wrapAsync(listings.deleteListing));  // Delete Route

// Edit Route
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listings.renderEditForm));

router.get("/filter/:category", wrapAsync(listingController.filterListings));

module.exports = router;
module.exports.index = async (req, res) => {
    try {
        const allListing = await Listing.find({});
        console.log("Fetched Listings:", allListing);  // Debugging step
        res.render("./listings/index.ejs", { allListing }); // Ensure this line exists
    } catch (error) {
        console.error("Error fetching listings:", error);
        res.redirect("/error");
    }
};

