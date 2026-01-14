const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");
const { validateSingup, validateLogin } = require("../middleware.js");

const userController = require("../controllers/users.js")

router
    .route("/signup")
    .get(userController.renderSignupForm)
    .post(
        validateSingup, //joi checks is this request even valid (for singup)
        wrapAsync(userController.Signup)
    )

router
    .route("/login")
    .get(userController.renderLoginForm)
    .post(
        saveRedirectUrl,
        validateLogin, //joi checks is this request even valid (for login)
        passport.authenticate("local", { //middleware to check if user exist in db or not
            failureRedirect: "/login",
            failureFlash: true
        }),
        wrapAsync(userController.Login)
    )

router.get("/logout", userController.Logout);

module.exports = router;