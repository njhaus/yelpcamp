import { Router } from "express";

// Controllers
import * as reviewsCntrl from "./controllers/campgrounds_reviewsCntrl.js";

// validataion utility functions
import {
  validateReview,
  verifyAuth,
  authorizeReview,
} from "../utilities/validation_utilities.js";

// async utilities
import { handleAsync } from "../utilities/async_utilities.js";

// Router setup
const router = Router({ mergeParams: true });

// Post review
router.post(
  "/",
  verifyAuth,
  validateReview,
  handleAsync(reviewsCntrl.postReview)
);

// Delete review
router.delete(
  "/:reviewId",
  verifyAuth,
  authorizeReview,
  handleAsync(reviewsCntrl.deleteReview)
);

// Show editing review
// Save edited review
router
  .route("/edit/:reviewId")
  .get(verifyAuth, authorizeReview, handleAsync(reviewsCntrl.renderReviewEdit))
  .patch(
    verifyAuth,
    authorizeReview,
    handleAsync(reviewsCntrl.saveEditedReview)
  );

export default router;
