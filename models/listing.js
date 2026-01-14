//basic model for listing of places (MONGOOSE SCHEMA)
//containing 
// - title
// - description
// - image
// - price
// - location
// - country

const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js");
const listingSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    
    image: {
        url: String,
        filename: String
    },
    price: {
        type: Number,
        required: true,
        min: [1, "Price must be greater than 0"]
    },
    location: {
        type: String,
        required: true
    },
    country: {
        type: String,
        required:true
    },
    reviews:[ //reviews must be in an array
        {
            type: Schema.Types.ObjectId,
            ref: "Review"
        },
    ],
    owner:{
        type: Schema.Types.ObjectId,
        ref: "User"
    }
});

//delete the review when related listing is deleted
//SCHEMA MIDDLEWARE
listingSchema.post("findOneAndDelete", async(listing) => {
    if(listing){
        await Review.deleteMany({_id: {$in: listing.reviews}});
    }
});

const Listing = mongoose.model("Listing", listingSchema); //bridge b/w js and Db
module.exports = Listing; //shares the bridge with rest of the app