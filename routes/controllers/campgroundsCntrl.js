// Database Models
import Campground from "../../models/campground.js";
import User from "../../models/user.js";
import { getGeolocationSearch, imgIdExtractAndDelete } from "../utilities/campground_utils.js";

// ROUTE FUNCTIONALITY

// Main campgrounds -- show all index
export const index = async (req, res, next) => {
  const campgrounds = await Campground.find({});
  const lastViewed = req.session.lastViewed;
  const filter = {};
  res.render("campgrounds/index.ejs", { campgrounds, lastViewed, filter });
};

// Search filter for campgrounds -- searches for campgrounds, then renders index page with filtered list
export const search = async (req, res) => {
  const { title, city, state } = req.query;
  // Set coordinates and search radius -- use default if not given
  const miles = req.query?.miles || 10000;
  // Use center-of-us coordinates as default:
  let coords = [-94.59179687498357, 39.66995747013945];
  // Other defaults:
  const filter = {};
  let campgrounds = await Campground.find();
  // If location is entered, find tose coordinates instead:
  if (city || state) coords = await getGeolocationSearch(city, state);
  // If location is legit and coordinates can be found:
  if (coords) {
    // Convert miles to Latitude and Longitude
    const longitudeRange = (1 / 54) * miles;
    const latitudeRange = (1 / 69) * miles;
    // Find campgrounds based on search terms
    campgrounds = await Campground.find({
      title: { $regex: title, $options: "i" },
      "geocode.coordinates.0": {
        $gte: coords[0] - longitudeRange,
        $lte: coords[0] + longitudeRange,
      },
      "geocode.coordinates.1": {
        $gte: coords[1] - latitudeRange,
        $lte: coords[1] + latitudeRange,
      },
    });
    // Send filter and last viewed information to the page
    filter.title = title;
    filter.city = city;
    filter.state = state;
    if (miles !== 10000) {filter.miles = miles }
    if (city && state) { filter.coords = coords;}
  }
  // IF coodes can NOT be found (Bad location entered by user)
  else {
    coords = [-94.59179687498357, 39.66995747013945];
    req.flash("error", `Location entered cannot be found.`);
  }
  const lastViewed = req.session.lastViewed;
  res.render(
    "campgrounds/index.ejs",
    {message: req.flash('error'), campgrounds, lastViewed, filter }
  );
}

// Make new campground
export const renderNewCampground = async (req, res, next) => {
  res.render("campgrounds/new.ejs");
};


// Submit new campground
export const submitNewCampground = async (req, res, next) => {
  const info = req.body;
  const imgs = req.imgs;
  const userId = req.user._id;
  const geocode = req.body.geocode;
  const user = await User.findById(userId);
  const newCampground = new Campground({
    title: info.title,
    location: info.city + ", " + info.state,
    description: info.description,
    geocode: geocode,
    price: info.price,
    img: imgs,
    createdBy: user._id,
  });
  // console.log(newCampground);
  const campground = await newCampground.save();
  req.flash("success", `Successfully created ${campground.title}`);
  res.redirect("/campgrounds");
};


// Show one campground -- campground show page.
export const viewOneCampground = async (req, res, next) => {
  const id = req.params.id;
  const campground = await Campground.findById(id)
    .populate("createdBy")
    .populate("reviews");
  const editing = null;
  res.render("campgrounds/show.ejs", { campground, editing });
};


// Edit one campground
export const renderEditCampground = async (req, res, next) => {
  const id = req.params.id;
  const campground = await Campground.findById(id);
  res.render("campgrounds/edit.ejs", { campground });
};


// Save edited campground
export const submitEditCampground = async (req, res, next) => {
  const id = req.params.id;
  const info = req.body;
  const imgs = req.imgs;
  const geocode = req.body.geocode;
  const delImgs = req.body.deleteImg;
  console.warn(delImgs);
  // Delete images
  const delCampgroundImgs = await Campground.findByIdAndUpdate(id, {
    $pull: {
      img: { url: delImgs },
    },
  });
  if (delImgs) {
    // Extract id from url and delete
    for (let img of delImgs) {
      if (img.match("cloudinary")) imgIdExtractAndDelete(img);
    }
  }
  // update campground
  const saveCampground = await Campground.findByIdAndUpdate(id, {
    title: info.title,
    location: info.city + ", " + info.state,
    geocode: geocode,
    description: info.description,
    price: info.price,
    $push: {
      img: imgs,
    },
  });
  // console.log(saveCampground);
  req.flash("success", `Successfully updated ${saveCampground.title}`);
  res.redirect(`/campgrounds/${id}`);
};


// Delete one campground
export const deleteCampground = async (req, res, next) => {
  const id = req.params.id;
  const deletedCampground = await Campground.findByIdAndDelete(id);
  // delete images from cloudinary
  for (let img of deletedCampground.img) {
    if (img.url.match('cloudinary')) imgIdExtractAndDelete(img.url); 
  }
  req.flash("success", `Successfully deleted ${deletedCampground.title}`);
  res.redirect("/campgrounds");
};
