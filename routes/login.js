import { Router } from "express";
import passport from "passport";

// Authorization Utility functions
import {
  validateUser,
} from "../utilities/validation_utilities.js";

// async utilities
import { handleAsync } from "../utilities/async_utilities.js";

const router = Router();

// Controllers
import * as loginCntrl from "./controllers/loginCntrl.js";

// Register (render and post)
router
  .route("/register")
  .get(loginCntrl.renderRegister)
  .post(validateUser, handleAsync(loginCntrl.submitRegister));

  // render Login
router.get("/", loginCntrl.renderLogin);

// check login
router.get("/logout", loginCntrl.logoutUser);

// Use passport to login with local strategy
router.post(
  "/local",
  passport.authenticate("local", {
    failureFlash: true,
    failureRedirect: "/login",
  }),
  loginCntrl.loginUser
);

export default router;
