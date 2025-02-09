const express = require("express");
const router = express.Router();
const listings = require("../controllers/listings");
const wrapAsync = require("../utils/wrapAsync.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
const multer = require("multer");
const {storage} = require("../cloudConfig.js")
const upload = multer({ storage });
const listingController = require("../controllers/listings.js")
// Define "/new" before "/:id" to prevent conflicts
router.get("/new", isLoggedIn, listings.renderNewForm);

// Index Route
router.route("/")
    .get(listings.index)
    .post(isLoggedIn,upload.single("listing[image]"),wrapAsync(listingController.createListing)
) 
    

// Routes for a specific listing (order is important)
router.route("/:id")
    .get(wrapAsync(listings.showListing))  // Show Route
    .put(isLoggedIn, isOwner, validateListing, wrapAsync(listings.updateListing))  // Update Route
    .delete(isLoggedIn, isOwner, wrapAsync(listings.deleteListing));  // Delete Route

// Edit Route
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listings.renderEditForm));

module.exports = router;
