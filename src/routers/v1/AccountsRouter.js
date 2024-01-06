const router = require("express").Router();
// Custom Functions:
// Models:
// Accounts Routers:
// /api/v1/accounts/
router.route("/").get((req, res) => {
  return res.status(200).json({
    message: "Accounts Default Branch",
  });
});
// /api/v1/accounts/demo
router.route("/demo").get((req, res) => {
  return res.status(200).json({
    message: "Inside demo",
  });
});
// Exports:
module.exports = router;
