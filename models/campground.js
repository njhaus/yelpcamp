import mongoose from "mongoose";
import Review from "./reviews.js";

// IMAGE SCHEMA (To use within Campgrounds schema only)
const ImageSchema = new mongoose.Schema({
    url: String,
    filename: String
})

const GeoCodeSchema = new mongoose.Schema({
        type: {
            type: String,
        },
        coordinates: [Number] 
})

// Validator function for Campgrounds images.
const arrayLimit = (val) => {
  return val.length <= 5;
};

// CAMPGROUNDS SCHEMA
const CampgroundSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  img: {
    type: [ImageSchema],
    validate: [arrayLimit, "You've reached the 5-photo limit."],
  },
  description: {
    type: String,
    required: true,
  },
  geocode: {
    type: GeoCodeSchema,
  },
  price: {
    type: Number,
    required: true,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: "Review" }],
});

CampgroundSchema.index({ title: 'text' });

CampgroundSchema.virtual("thumbnail").get(function () {
    const thumbnails = []
    for (let image of this.img) {
        if (image.url.match(/cloudinary/)) {
          const splitUrl = image.url.split("/upload");
          thumbnails.push(splitUrl[0] + "/upload//c_fill,h_300,w_400" + splitUrl[1]);
        } else {
          thumbnails.push(image.url);
        }
    }
    return thumbnails;
});

CampgroundSchema.methods.getPhoto = (function (size) {
    const photos = []
    const photoSize = size === 's' ? 'h_300,w_400' : 'h_600,w_800';
    for (let image of this.img) {
        if (image.url.match(/cloudinary/)) {
          const splitUrl = image.url.split("/upload");
          photos.push(splitUrl[0] + "/upload/c_fill," + photoSize + splitUrl[1]);
        } else {
          photos.push(image.url);
        }
    }
    return photos;
});

CampgroundSchema.pre('findOneAndDelete', async function () {
    try {
        const id = await this.getFilter()._id;
        const campground = await Campground.findById(id);
        const reviews = campground.reviews;
        console.log('REVIEWS: ' + reviews);
        await Review.deleteMany({ _id: { $in: reviews } });
    } catch (err) {
        console.log(err);
    }
})


const Campground = mongoose.model('Campground', CampgroundSchema);

export default Campground;
