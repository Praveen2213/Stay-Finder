const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose").default;

const userSchema = new Schema({
    email:{
        type: String,
        required: true
    }
    //other things like username and password will automatically be defined by passport local mongoose
});

userSchema.plugin(passportLocalMongoose); //“Attach Passport-Local-Mongoose features to User schema.”  

module.exports = mongoose.model("User", userSchema);