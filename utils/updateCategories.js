const mongoose = require("mongoose");
const Listing = require("../models/listing");

// Update this with your MongoDB connection string
mongoose.connect("mongodb://127.0.0.1:27017/enjoyway");

const categories = ["trending", "rooms", "iconic-cities", "mountain", "castles", "pools", "camping", "farms", "arctic"];

async function updateListings() {
  try {
    const listings = await Listing.find({});
    for (let listing of listings) {
      listing.category = categories[Math.floor(Math.random() * categories.length)];
      await listing.save();
    }
    console.log("Successfully updated listings with categories");
  } catch (error) {
    console.error("Error updating listings:", error);
  } finally {
    mongoose.connection.close();
  }
}

updateListings();