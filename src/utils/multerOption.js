const multer = require("multer");
const fse = require("fs-extra");
const path = require("path");
// Custom Utils:
// Define Storage:
/* this will be (always) saved to a temp directory */
function fileStorage(destDir) {
  return multer.diskStorage({
    // check if temp dir exist, if not create it
    destination: function (req, file, cb) {
      try {
        fse.ensureDirSync(destDir);
      } catch (error) {
        console.error(error);
      }
      cb(null, destDir);
    },
    // generate a new file name
    filename: function (req, file, cb) {
      const ext = "." + file.mimetype.split("/")[1];
      const uniqueSuffix =
        file.fieldname +
        "-" +
        Date.now() +
        "-" +
        Math.round(Math.random() * 1e9) +
        ext;
      cb(null, uniqueSuffix);
    },
  });
}
// Image Only File Filter:
const imageFileFilter = function (req, file, callback) {
  var ext = path.extname(file.originalname);
  if (ext !== ".png" && ext !== ".jpg" && ext !== ".jpeg") {
    return callback(new Error("Only images are allowed"));
  }
  callback(null, true);
};
// Fine Size 5mb:
const fileSize5mb = {
  fileSize: 5 * 1024 * 1024,
};
// Exports:
module.exports = { fileStorage, imageFileFilter, fileSize5mb };
