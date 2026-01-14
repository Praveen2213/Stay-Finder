//logic of initialization is written here
const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/StayFinder";

main().then(() => {
    console.log("Connected to DB");
}).catch((err) => {
    console.log(err);
});

async function main() {
  await mongoose.connect(MONGO_URL);
}

const initDB = async () => {
    await Listing.deleteMany({}); //clean the database before adding new data
    initData.data = initData.data.map((obj) => ({
        ...obj, //jo object hai vo toh rhega hi bs owner add krna hai
        owner: "6961fed177585d609176e64c" //reinitializing the database with owner
    }));
    await Listing.insertMany(initData.data); //where initData.data is array of data stored inside initData exported from data.js
    console.log("data was initialize");
}

//initDB(); // ❌ Dangerous: running this here will reset the database every time the
// app starts

module.exports = initDB;
// ✅ Export the function so it does NOT run on app startup
// Run this file manually only when you want to seed the database
// Example: node index.js (or nodemon index.js)