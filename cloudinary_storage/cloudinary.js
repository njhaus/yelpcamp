import dotenv from "dotenv";
dotenv.config({ silent: process.env.NODE_ENV === "production" });

import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CL_CLOUD_NAME,
  api_key: process.env.CL_API_KEY,
  api_secret: process.env.CL_API_SECRET,
});

// upload files
export async function handleUpload(file) {
  const data = await cloudinary.uploader.upload(file, {
    resource_type: "auto",
    folder: "yelpcamp",
  });
  return data;
}

// remove files
export const cloudinaryDelete = (imgId) => {
  cloudinary.uploader
    .destroy(`yelpcamp/${imgId}`)
    .then((resp) => console.dir(resp))
    .catch(err => console.log(err));
};
