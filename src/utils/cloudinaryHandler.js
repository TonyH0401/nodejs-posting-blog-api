require("dotenv").config();
const cloudinary = require("cloudinary").v2;
const fse = require("fs-extra");
const path = require("path");
// Constant Declarations:
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});
// Cloudinary Uploader:
async function cloudinaryUploader(filePath) {
  try {
    const result = await cloudinary.uploader.upload(filePath);
    if (!result) {
      // idk, this seems redundant
      fse.unlinkSync(filePath);
      return {
        code: 0,
        success: false,
        message: "Cloudinary Error When Upload!",
      };
    }
    return {
      code: 1,
      success: true,
      message: "Uploaded to Cloudinary!",
      data: result,
    };
  } catch (error) {
    return {
      code: 0,
      success: false,
      message: error.message,
    };
  }
}
// CLoudinary Destroyer:
async function cloudinaryDestroyer(publicId) {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return {
      code: 1,
      success: true,
      data: result,
    };
  } catch (error) {
    return {
      code: 0,
      success: false,
      message: error.message,
    };
  }
}
// Exports:
module.exports = { cloudinaryUploader, cloudinaryDestroyer };
/* check this link out:
https://github.com/keysKuo/NodeJs-EzTicket-Backend-V2/blob/main/src/resources/Event/Resolver.js */
