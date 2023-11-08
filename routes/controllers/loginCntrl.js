// Database models
import User from "../../models/user.js";

export const renderRegister = (req, res) => {
  res.render("login/register.ejs");
};

export const submitRegister = async (req, res) => {
    const { username, email, password, trusted } = req.body;
    const existingUser = await User.findOne({ username: username });
    if (!existingUser) {
        try {
            const user = new User({ username: username, email: email });
            const registeredUser = await User.register(user, password);
            req.flash("success", `Welcome to YelpCamp, ${username}!`);
            await req.login(registeredUser, function (err) {
                if (err) res.redirect('/login');
                return res.redirect('/campgrounds');
            })    
        } catch (err) {
            // console.log('MESSAGE:' + err.details.message);
            let errMsg = "Error registering. Please try again later.";
            if (err.code && err.code === 11000) errMsg = "There is already an account associated with this email address.";
            if (err.details && err.details.message.matches('"password" fails to match the required pattern')) errMsg = 'Your passowrd must have 1 uppercase letter, 1 lowercase letter, and 1 number or special symbol.'
            req.flash('error', errMsg);
            res.redirect('/login/register');
        }
    }
    else {
        req.flash("error", "A user with this username already exists");
        res.redirect("/login/register");
    }
}

export const renderLogin = (req, res, next) => {
  const { path } = req.query;
  res.render("login/login.ejs", { path });
};

export const logoutUser = (req, res, next) => {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        res.clearCookie("trustedDevice");
        req.flash('success', 'You have been logged out.');
        res.redirect('/login')
    })
}

export const loginUser = (req, res, next) => {
  const { username, trusted } = req.body;
  const path = req.query.path || "/campgrounds";
  if (trusted === "on") {
    // Set cookie to logged in on this device
    res.cookie("trustedDevice", username, {
      maxAge: 1000 * 60 * 60 * 24 * 7,
      signed: true,
    });
  }
  req.flash("success", `Welcome back, ${username}`);
  res.redirect(path);
};