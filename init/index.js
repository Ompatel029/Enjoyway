const mongoose = require('mongoose');
const initdata = require("./data.js");
const Listing = require("../models/listing.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/Enjoyway";

async function main() {
  try {
    await mongoose.connect(MONGO_URL);
    console.log("Connected to DB");
    await initDB();
    mongoose.connection.close();
  } catch (err) {
    console.error("DB Connection Error:", err);
  }
}

const initDB = async () => {
    //await Listing.deleteMany({});
    initdata.data = initdata.data.map((obj) => ({
      ...obj,
      owner: "67930636729e2ab01d1180b9",
    }));
    await Listing.insertMany(initdata.data);
    console.log("Data was initialized");
  
};

main();
