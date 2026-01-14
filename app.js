if(process.env.NODE_ENV != "production"){
    require('dotenv').config();
}
// console.log(process.env.CLOUD_API_SECRET);

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js"); //new
const session = require("express-session");
const MongoStore = require("connect-mongo").default;
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");


// const MONGO_URL =  "mongodb://127.0.0.1:27017/StayFinder"; //mongo database
const dbUrl = process.env.ATLASDB_URL; //atlas database


main().then(() => {
    console.log("Connected to DB");
}).catch((err) => {
    console.log(err);
});

async function main() {
//   await mongoose.connect(MONGO_URL); //mongo database
     await mongoose.connect(dbUrl); //atlas database
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "/public")));

app.engine('ejs', ejsMate);

const store = MongoStore.create({
    mongoUrl : dbUrl,
    crypto :{ //store address in encrypted form
        secret: process.env.SECRET
    },
    touchAfter: 24 * 3600,
});

store.on("error", () =>{
    console.log("Error in mongo session store", err);
});

const sessionOptions = { 
    store,
    secret: process.env.SECRET, 
    resave: false, 
    saveUninitialized: true,
    cookie:{
        expires: Date.now() + 7 * 24 * 60 * 60 *1000,
        maxAge: 7 * 24 * 60 * 60 *1000,
        httpOnly: true
    }
};

// app.get("/", (req, res) =>{
//     res.send("Hi, I am root");
// });



app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()))

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//middleware
app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
});

// app.get("/demouser", async (req, res)=>{
//     let fakeUser = new User({
//         email: "praveen@gmail.com",
//         username: "praveen2212"
//     });
//     let registeredUser = await User.register(fakeUser, "helloWorld"); 
//     res.send(registeredUser);
// });

app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);

//Not-Found Error Handler
app.use((req, res, next) =>{ //if no above route matched 
    next(new ExpressError(404, "Page not found!"));
});

app.use((err, req, res, next) =>{
    let {statusCode = 500, message = "some error occured"} = err;
    res.status(statusCode).render("error.ejs", {message});
});

app.listen("3000", () => {
    console.log("listening to port 3000");
});


// app.get("/testListing", async (req, res) =>{
//     let sampleListing = new Listing({
//         title: "My New Villa",
//         description: "By The Beach",
//         price: 1200,
//         location: "Jaipur",
//         country: "India"
//     });

//     await sampleListing.save();
//     console.log("sample saved");
//     res.send("Successful");
// }); 
