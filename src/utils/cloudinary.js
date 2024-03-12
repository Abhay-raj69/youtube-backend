import { v2 as cloudinary } from "cloudinary";

// fs is a file system inside nodejs
import fs from "fs";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD - NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_KEY,
});

const uploadOnCloudinary = async (localFilePath) => {
  try {
    // if local path not found then return null
    if (!localFilePath) {
      return null;
    }
    // upload the files
    const response = await cloudinary.uploader.upload(localFilePath, {
      // it will tell us which type of file is uploaded
      resource_type: "auto",
    });
    // file has been uploaded successfully
    console.log("File is uploaded on cloudinary", response.url);
    return response;
  } catch (error) {
    fs.unlinkSync(localFilePath); // remove the locally saved temporary file as the upload operation got failed
    return null;
  }
};

export { uploadOnCloudinary };
