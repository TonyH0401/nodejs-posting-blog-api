const mongoose = require("mongoose");
// MongoDB Server Uri:
const mongoDbUri = process.env.MONGODB;
// Mongoose Options:
const mongoDbOptions = { useNewUrlParser: true, useUnifiedTopology: true };
// Connect MongoDB using Mongoose:
const dbConnection = mongoose.createConnection(mongoDbUri, mongoDbOptions);
// Listen for Connection Events:
dbConnection.on("connected", () => {
  console.log("> API 1 connected to MongoDB");
});
dbConnection.on("error", (err) => {
  console.error("> API 1 connection error:", err);
});
dbConnection.on("disconnected", () => {
  console.log("> API 1 disconnected from MongoDB");
});
// Exports:
module.exports = { dbConnection };
