// Database Models
import Campground from "../../models/campground.js";
import Review from "../../models/reviews.js";
import User from "../../models/user.js";


export const postReview = async (req, res, next) => {
  console.log("I AM HERE NOW");
  const id = req.params.id;
    const campground = await Campground.findById(id);
    const currentUser = req.user?.username || "guest";
    const user = await User.findOne({ username: currentUser });
    if (user) {
      const { text, rating } = req.body.review;
      const numRating = parseInt(rating);
      const newReview = new Review({ rating: numRating, text });
      newReview.user = user.username;
      await newReview.save();
      campground.reviews.push(newReview._id);
      await campground.save();
      user.reviews.push(newReview._id);
      await user.save();
    } else {
      req.flash("error", "You must be logged in to write a review");
      res.redirect(`/campgrounds/${id}`);
    }
    res.redirect(`/campgrounds/${id}`);
};

export const deleteReview = async (req, res, next) => {
  const campgroundId = req.params.id;
  const reviewId = req.params.reviewId;
  await Review.findByIdAndDelete(reviewId);
  req.flash("success", "Review successfully deleted!");
  res.redirect(`/campgrounds/${campgroundId}`);
};

export const renderReviewEdit = async (req, res, next) => {
  const id = req.params.id;
  const campground = await Campground.findById(id).populate("reviews");
  const editing = req.params.reviewId;
  res.render("campgrounds/show.ejs", { campground, editing });
};

export const saveEditedReview = async (req, res, next) => {
  const campgroundId = req.params.id;
  const reviewId = req.params.reviewId;
  const newText = req.body.text;
  await Review.findByIdAndUpdate(reviewId, { text: newText });
  req.flash("success", "Review successfully updated!");
  return res.redirect(`/campgrounds/${campgroundId}`);
};