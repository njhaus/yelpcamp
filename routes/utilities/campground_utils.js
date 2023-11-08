// env
import dotenv from "dotenv";
dotenv.config({ silent: process.env.NODE_ENV === "production" });
const RADAR_KEY = process.env.RADAR_TEST_PUBLISH;

// UserModels
import Campground from "../../models/campground.js";
import User from "../../models/user.js";

import multer from "multer";
const storage = multer.memoryStorage();
const upload = multer({ storage }).array("img", 5);
import {
  handleUpload,
  cloudinaryDelete,
} from "../../cloudinary_storage/cloudinary.js";

// middleware to edit last viewed session object (How long ago something was visited) triggered when campground/:id is veiwed)
export function lastViewed(req, res, next) {
  const id = req.params.id;
  if (req.session.lastViewed) {
    const views = req.session.lastViewed;
    const hasViewed = views.find((view) => view.id === id);
    if (hasViewed) {
      hasViewed.timestamp = Date.now();
    } else {
      views.push({
        id: id,
        timestamp: Date.now(),
      });
    }
  } else {
    req.session.lastViewed = [];
  }
  next();
}

// middleware to check campground id, retrun error otherwise.
export async function checkId(req, res, next) {
  const id = req.params.id;
  try {
    const campground = await Campground.findById(id);
    if (campground) {
      next();
    }
  } catch (err) {
    req.flash("error", "The campground you are looking for does not exist.");
    res.redirect("/campgrounds");
    console.log(err);
  }
}

// Authorize campground (make sure correct user)
export async function authorizeCampground(req, res, next) {
  const user = req.user;
  const campgroundId = req.params.id;
  try {
    const campground = await Campground.findById(campgroundId);
    const user = await User.findById(user._id);
    if (campground && user && campground.createdBy === user._id) {
      next();
    } else {
      req.flash("error", "You must be logged in to perform this action.");
      res.redirect(`campgrounds/${campgroundId}`);
    }
  } catch (err) {
    res.flash("error", "Error finding campground.");
    res.redirect(`campgrounds/${campgroundId}`);
  }
}

// middleware to upload image files andcheck if correct amount of files are being uploaded
export const parseImg = (req, res, next) => {

  upload(req, res, function (err) {
    if (err) {
      req.flash("error", "Upload limit of 5 files");
      return res.redirect(req.originalUrl);
    } else {
      next();
    }
  });
};

// Middleware to handle file upload to cloudinary
export const multerUploadHandler = async (req, res, next) => {
  const origUrl = req.originalUrl;
  req.imgs = [];
  if (req.files && req.files.length <= 5) {
    for (let file of req.files) {
      try {
        const b64 = Buffer.from(file.buffer).toString("base64");
        let dataURI = "data:" + file.mimetype + ";base64," + b64;
        const cldRes = await handleUpload(dataURI);
        req.imgs.push({ url: cldRes.url, filename: file.originalname });
      } catch (error) {
        console.log(error);
        req.flash("error", "There was an error uploading your images.");
        return res.redirect(origUrl);
      }
    }
  } else {
    req.flash("error", "Upload limit of 5 files.");
    return res.redirect(origUrl);
  }
  next();
};

// middleware to remove images from cloudinary
export const imgIdExtractAndDelete = (img) => {
    const spl = img.split(/[./]/);
  const delImg = spl[spl.length - 2];
    cloudinaryDelete(delImg);
};


// Cloudinary config
export const config = {
  api: {
    bodyParser: false,
  },
};


// Get gelocation for campground search and send data to map
export const getGeolocationSearch = async (city, state) => {
  try {
    const response = await fetch(
      `https://api.radar.io/v1/geocode/forward?query=${city}+${state}&country=US&layers=locality,state`,
      {
        method: "GET",
        headers: {
          Authorization: RADAR_KEY,
        },
      }
    );
    if (!response.ok) {
      console.log("Geolocation request failed with status:", response.status);
      throw new Error('error' + response.status)
    }
    const data = await response.json();
    // Return data if location found, return undefined otherwise
    if (data.addresses.length > 0) {
      console.log("FOUND LOCATION")
      console.log(data);
      return data.addresses[0].geometry.coordinates;
    }
    else {
      return undefined;
    }
  } catch (err) {
    console.error(err);
    throw err;
  }
};

// Get gelocation for new campground
export const getGeolocation = async (req, res, next) => {
  try {
    const response = await fetch(
      `https://api.radar.io/v1/geocode/forward?query=${city}+${state}&country=US&layers=locality,state`,
      {
        method: "GET",
        headers: {
          Authorization: RADAR_KEY,
        },
      }
    );
    if (response.ok) {
      const data = await response.json();
      req.body.geocode = data.addresses[0].geometry;
      next();
    } else {
      console.log("Geolocation request failed with status:", response.status);
      req.flash(
        "error",
        "There was an error finding the location of your campground. Please check the spelling of your location (city and state)."
      );
      res.redirect(req.originalUrl);
    }
  } catch (err) {
    console.error(err);
    req.flash(
      "error",
      "There was an error finding the location of your campground. Please check the spelling of your location (city and state)."
    );
    res.redirect(req.originalUrl);
  }
};
