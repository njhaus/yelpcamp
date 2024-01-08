// This route is used with front-end public javascript files to get data for maps

import { Router } from "express";

const router = Router();

import dotenv from "dotenv";
dotenv.config({ silent: process.env.NODE_ENV === "production" });

// Models
import Campground from "../models/campground.js";

// utilities
import { handleAsync } from "../utilities/async_utilities.js";

// Get map data for showing all maps page (fetched from index-map.mjs file)
router.get(
  "/allMapData",
  handleAsync(async (req, res) => {
    const campgrounds = await Campground.find({});
    res.send(campgrounds);
  })
);

// Get map data for showing ONE map page (fetched from show-map.mjs file)
router.get(
  "/oneMapData/:id",
  handleAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    res.send(campground);
  })
);

router.get("/getRadar", (req, res) => {
  const key = process.env.RADAR_TEST_PUBLISH;
  res.send(key);
});

router.get("/getMaptiler", (req, res) => {
  // This caused an issue in production...somehow the key was changed.
  // const key = process.env.MAPTILER_KEY;
  const key = "2XZKg54dnt7JS7AZhe7J";
  res.send({ key: key });
});

export default router;
