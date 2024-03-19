const mongoose = require("mongoose");
// MongoDB Server Uri:
const mongoDbUri = process.env.MONGODBURI;
// MongoDB Server Name:
const mongoDbServerName = process.env.MONGODBSERVERNAME;
// MongdoDB Options using Mongoose:
const mongoDbOptions = { useNewUrlParser: true, useUnifiedTopology: true };
// Connect to MongoDB using Mongoose:
const mongodbConn = mongoose.createConnection(
  mongoDbUri + mongoDbServerName,
  mongoDbOptions
);
// Listen for Connection Events:
mongodbConn.on("connected", () => {
  console.log("> API 1 connected to MongoDB");
});
mongodbConn.on("error", (err) => {
  console.error("> API 1 connection error:", err);
});
mongodbConn.on("disconnected", () => {
  console.log("> API 1 disconnected from MongoDB");
});
// Exports:
module.exports = { mongodbConn };
