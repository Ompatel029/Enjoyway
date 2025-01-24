const mongoose = require("mongoose");
const review = require("./review.js");
const Schema = mongoose.Schema;

const listingSchema = new Schema({
     title:{
         type: String,
         require: true
     },
     description:{ 
        type: String,
     },
     image: {
      type: String,
      default: "https://images.pexels.com/photos/186077/pexels-photo-186077.jpeg?cs=srgb&dl=pexels-binyaminmellish-186077.jpg&fm=jpg", 
      set: (v) => v === "" ? "https://images.pexels.com/photos/186077/pexels-photo-186077.jpeg?cs=srgb&dl=pexels-binyaminmellish-186077.jpg&fm=jpg" : v,
  },
  
     price: { 
        type: Number,
     },
     location: {
        type: String,
     },
     country: {
        type: String,
     },
     reviews: [
      {
         type: Schema.Types.ObjectId,
         ref:"Review",
      }
     ],
     owner: {
        type: Schema.Types.ObjectId,
        ref: "User",
     },
})

listingSchema.post("findOneAndDelete", async (listing) => {
  await review.deleteMany({
    _id: {
      $in: listing.reviews,
    },
  });
})

const Listing = mongoose.model("Listing",listingSchema)
module.exports = Listing;