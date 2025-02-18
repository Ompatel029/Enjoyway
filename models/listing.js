const mongoose = require("mongoose");
const review = require("./review.js");
const Schema = mongoose.Schema;

const listingSchema = new Schema({
   title:{
      type: String,
      required: true 
  },
     description:{ 
        type: String,
     },
     image: {
      url:String,
      filename:String,
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
     geometry: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point' // Default value
      },
      coordinates: {
        type: [Number],
        default: [0, 0] // Default coordinates
      }
    
   },
   category:{
      type: String,
      enum: ["trending", "rooms", "iconic-cities", "mountain", "castles", "pools", "camping", "farms", "arctic"],
      default: "trending"
    }
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