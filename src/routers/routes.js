// mainly change api version here
const router = require("express").Router();
// Require Versions' Index File:
// add the index file of each versions
const v1API = require("./v1/index");
// Name General API URL and Use Selected Versions:
// use the selected version's index file
// name the URL as /api/v123...
router.use("/api/v1", v1API);
// Exports:
module.exports = router;
