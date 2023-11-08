import { Router } from "express";

// Multer/cloudinary image handling
import multer from "multer";
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Controllers
import * as campgroundsCntrl from "./controllers/campgroundsCntrl.js";

// Validation utilities
import {
  verifyAuth,
  validateCampground,
} from "../utilities/validation_utilities.js";

// async utilities
import { handleAsync } from "../utilities/async_utilities.js";

// Campgrounds-specific utility funcitons/middleware
import {
  lastViewed,
  checkId,
  parseImg,
  multerUploadHandler,
  getGeolocation,
} from "../routes/utilities/campground_utils.js";

// Router setup
const router = Router();

//campgrounds routes
// view all campgrounds
router.get("/", lastViewed, handleAsync(campgroundsCntrl.index));

// Search filter campgorunds
router.get("/search", handleAsync(campgroundsCntrl.search));

// view new campground (must be logged in)
// post new campground (must be logged in)
router
  .route("/auth/new")
  .get(handleAsync(campgroundsCntrl.renderNewCampground))
  .post(
    verifyAuth,
    // Parse img must come before validate because it has the middleware to parse the body with images.
    parseImg,
    validateCampground,
    handleAsync(multerUploadHandler),
    handleAsync(getGeolocation),
    handleAsync(campgroundsCntrl.submitNewCampground)
  );

// View individual campground. "editing" is for users editing a review and is set to true in the reviews path
router.get(
  "/:id",
  checkId,
  lastViewed,
  handleAsync(campgroundsCntrl.viewOneCampground)
);

// edit campground (must be logged in)
// save edits (must be logged in)
router
  .route("/:id/auth/edit")
  .get(verifyAuth, checkId, handleAsync(campgroundsCntrl.renderEditCampground))
  .put(
    verifyAuth,
    // Parse img must come before validate because it has the middleware to parse the body with images.
    parseImg,
    validateCampground,
    checkId,
    handleAsync(multerUploadHandler),
    handleAsync(getGeolocation),
    handleAsync(campgroundsCntrl.submitEditCampground)
  );

// delete campground (must be logged in)
router.delete(
  "/:id/auth/delete",
  verifyAuth,
  checkId,
  handleAsync(campgroundsCntrl.deleteCampground)
);

export default router;
