const mongoose = require("mongoose");
// Environment Variable .env:
const mongodbURL = process.env.MONGODB;
// Connect MongoDB using mongoose:
function connectMongoDB() {
  return new Promise((resolve, reject) => {
    mongoose
      .connect(mongodbURL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      })
      .then(() => {
        console.log("> Connected to MongoDB");
        resolve(true);
      })
      .catch((err) => {
        console.error("> Error connecting to MongoDB:", err);
        resolve(false);
      });
  });
}
// Exports:
module.exports = { connectMongoDB };
