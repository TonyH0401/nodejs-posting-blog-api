require("dotenv").config();
const express = require("express");
const createError = require("http-errors");
const path = require("path");
// Custom Utils:
const { connectMongoDB } = require("./database/mongoose");
const { reqLogDev, reqLogDevErrOnly } = require("./utils/requestLogger");
// Environment Variable using .env:
const port = process.env.BE_PORT || 7070;
// Init App:
const app = express();
// App Use:
app.use(express.json());
app.use(reqLogDev);
// Default Router:
app.get("/", (req, res) => {
  console.log("Default Route!");
  return res.status(200).json({
    code: 1,
    success: true,
    message: "Default Branch!",
  });
});
// API Routers:
const v1API = require("./api/v1/routers/index");
app.use("/api/v1", v1API);
// Default Error Handling:
app.use((req, res, next) => {
  // create an error 404 with message "This directory does not exist!" using createError
  // pass on to the next middleware an error using next()
  next(createError(404, "This directory does not exist!"));
});
app.use((err, req, res, next) => {
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};
  res.status(err.status || 500);
  return res.status(404).json({
    code: 0,
    success: false,
    message: err.message || "",
  });
});
// Connect Database:
connectMongoDB();
// Init Server:
app.listen(port, () => {
  console.log(`> Website running at http://localhost:${port}`);
});
