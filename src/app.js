require("dotenv").config();
const express = require("express");
const createError = require("http-errors");
const path = require("path");
// Custom Utils:
const { reqLogDev, reqLogDevErrOnly } = require("./utils/requestLogger");
// Environment Variable (.env):
const port = process.env.BE_PORT || 8080;
// Init App:
const app = express();
// App Use:
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
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
const v1API = require("./api/v1/routes");
app.use("/api/v1", v1API);
// Default Error Handling:
app.use((req, res, next) => {
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
// Init Server:
app.listen(port, () => {
  console.log(`> Website running at http://localhost:${port}`);
});
