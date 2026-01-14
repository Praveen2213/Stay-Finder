const User = require("../models/user.js");

module.exports.renderSignupForm = (req, res) => {
    res.render("./users/signup.ejs");
};

module.exports.Signup = async (req, res, next) => {
    try {
        let { username, email, password } = req.body;
        const newUser = new User({ username, email });
        const registeredUser = await User.register(newUser, password);
        // console.log(registeredUser);
        req.login(registeredUser, (err) => {
            if (err) {
                return next(err);
            }
            req.flash("success", "Welcome to StayFinder!");
            res.redirect("/listings");
        })
    }
    catch (err) {
        req.flash("error", err.message);
        res.redirect("/signup");
    }
};

module.exports.renderLoginForm = (req, res) => {
    res.render("./users/login.ejs");
};

module.exports.Login = async (req, res) => {
    req.flash("success", "Welcome Back to StayFinder");
    let redirectUrl = res.locals.redirectUrl || "/listings"; // this means if res.locals.redirectUrl exist tb uspe redirect kr do nhi toh /listings pe kr do after login
    delete req.session.redirectUrl;
    res.redirect(redirectUrl);
}

module.exports.Logout = (req, res) => {
    req.logOut((err) => {
        if (err) {
            next(err);
        }
        req.flash("success", "You are logged out now");
        res.redirect("/listings");
    })
}