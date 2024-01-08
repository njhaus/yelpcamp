// TODO before delpoyment
// uncomment secure: true in session cookie options

// Import dependencies
import express from "express";
import mongoose, { trusted } from "mongoose";
import ejs from "ejs";
import methodOverride from "method-override";
import morgan from "morgan";
import engine from "ejs-mate";
import cookieParser from "cookie-parser";
import session from "express-session";
import flash from "connect-flash";
import passport from "passport";
import multer from "multer";
import bodyParser from "body-parser";

// Auth and Security
import LocalStrategy from "passport-local";
import mongoSanitize from "express-mongo-sanitize";
import dotenv from "dotenv";
dotenv.config({ silent: process.env.NODE_ENV === "production" });
import helmet from "helmet";

// Cloud Database (Mongo Atlas)
const dbUrl =
  process.env.DB_URL ||
  "mongodb://127.0.0.1:27017/campgroundsDB";
//  Store session in Mongo Atlas
import MongoStore from "connect-mongo";
const store = MongoStore.create({
  mongoUrl: dbUrl,
  touchAfter: 24 * 60 * 60,
  crypto: {
    secret: process.env.SESSION_SECRET,
  }
})
store.on('error', function (e) {
  console.log('session store error');
})



// utilities
import { AppError } from "./utilities/validation_utilities.js";

// Import and initialize stuff to make __dirname work
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Import database models
import User from "./models/user.js";

// password auth middleware functions -- imported from utilities
import { verifyAuth } from "./utilities/validation_utilities.js";

// express setup
const app = express();
const port = process.env.PORT || 3000;
app.listen(port, '0.0.0.0', () => console.log(`Server is running. Better go and catch it!`));
app.use(express.urlencoded({ extended: true }));

// ejs and ejs mate setup
app.engine("ejs", engine); //app.get('/') route below includes boilerplate information
// app.set('view engine', ejs); -- replaced by ejs mate engine
app.set("views", path.join(__dirname, "/views"));

// setup morgan
morgan("tiny");

// static setup
app.use(express.static(path.join(__dirname, "public")));
app.use(express.static(path.join(__dirname, "public/campgrounds")));
app.use(express.static(path.join(__dirname, "public/validation")));
app.use(express.static(path.join(__dirname, "public/reviews")));
app.use(express.static(path.join(__dirname, "public/img")));
app.use(express.static(path.join(__dirname, "public/all")));
app.use(express.static(path.join(__dirname, "public/home")));
app.use(express.static(path.join(__dirname, "public/login")));
app.use(express.static(path.join(__dirname, "public/about")));

// setup method override
app.use(methodOverride("_method"));

// cookie parser
app.use(cookieParser("code"));

// Body-parser
app.use(bodyParser.urlencoded({ extended: false }));

// session setup
const sessionConfig = {
  store,
  name: "yelpcamp-session",
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    // secure: true,
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
  httpOnly: true,
};
app.use(session(sessionConfig));

// flash setup
app.use(flash());

// Passport setup
// Add this before defining routes But AFTER session setup
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  if (req.user) {
    console.log("User detected");
  } else {
    console.log("no user");
  }
  next();
});


// Helmet authorized routes
const scriptSrcUrls = [
  "https://js.radar.com",
  "https://unpkg.com",
  "https://js.radar.com/",
  "https://maplibre.org",
  "https://cdn.jsdelivr.net/",
  "https://cdnjs.cloudflare.com",
];
const styleSrcUrls = [
  "https://cdn.jsdelivr.net",
  "https://js.radar.com/",
  "https://unpkg.com",
  "https://fonts.googleapis.com",
  "https://fonts.gstatic.com",
];
const fontSrcUrls = [
  "https://cdn.jsdelivr.net",
  "https://js.radar.com/",
  "https://radar.com/",
  "https://unpkg.com",
  "https://fonts.googleapis.com",
  "https://fonts.gstatic.com",
];
const connectSrcUrls = ["https://api.maptiler.com", "https://api.radar.io" ];
const imgSrcUrls = [
  "https://res.cloudinary.com/dnnwjgqa2",
  "https://images.unsplash.com",
];

// Helmet
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", ...scriptSrcUrls],
        styleSrc: ["'self'", ...styleSrcUrls],
        fontSrc: [...fontSrcUrls],
        imgSrc: ["'self'", "data:", "blob:", "https:", ...imgSrcUrls],
        workerSrc: ["'self'", "blob:"],
        childSrc: ["'self'", "blob:"],
        connectSrc: ["'self'", ...connectSrcUrls],
      },
    },
  })
);

// mongo sanitize
app.use(mongoSanitize());

// Mongoose setup

async function main() {
  try {
    await mongoose.connect(dbUrl);
    console.log("Database connection successful");
  } catch (err) {
    console.log(err);
  }
  // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
}
main();

// locals setup
app.use((req, res, next) => {
  req.app.locals.success = req.flash("success");
  req.app.locals.error = req.flash("error");
  req.app.locals.message = req.flash("message");
  res.locals.currentUser = req.user;
  next();
});

// Set cookies upon initial visit of ANY page if new ip address / check if new session
app.use(async (req, res, next) => {
  const { trustedDevice } = req.signedCookies;
  const user = req.user;
  if (!user && trustedDevice) {
    const trustedUser = await User.findOne({ username: trustedDevice });
    req.login(trustedUser, function (err) {
      if (err) res.redirect("/login");
      return next();
    });
  } else {
    return next();
  }
});

// password auth route middleware (Do BEFORE accessing route)
app.get(/auth/, verifyAuth, (req, res, next) => {
  next();
});

app.post(/auth/, verifyAuth, (req, res, next) => {
  next();
});

app.delete(/auth/, verifyAuth, (req, res, next) => {
  next();
});

// MAIN ROUTES

app.get("/", (req, res) => {
  res.redirect("/home");
})


app.get("/home", (req, res) => {
  res.render("home/home.ejs");
});

// ROUTERS
import loginRoute from "./routes/login.js";
import campgroundRoute from "./routes/campgrounds.js";
import campgroundReviewRoute from "./routes/campgrounds_reviews.js";
import dataRoute from "./routes/data.js";
import aboutRoute from './routes/about.js'

app.use("/campgrounds", campgroundRoute);
app.use("/campgrounds/:id/review/", campgroundReviewRoute);
app.use("/login", loginRoute);
app.use("/data", dataRoute);
app.use("/about", aboutRoute);


// ROUTE NOT FOUND -- catchalls

app.use((req, res, next) => {
  const error = new AppError("This page does not exist.", 404);
  console.log(error);
  console.log("MESSAGE:" + error.message);
  next(error);
});

app.use((err, req, res, next) => {
  console.log(err);
  const { message = "Sorry, something went wrong.", status = 500 } = err;
  console.log(message, status);
  res.status(status);
  res.render("error/error.ejs", { status, message });
});
