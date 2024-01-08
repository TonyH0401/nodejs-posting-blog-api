const router = require("express").Router();
const createError = require("http-errors");
// Customer Middlewares, Utils:
// Import Models:
// Accounts Routers:
// /api/v1/accounts/
router.route("/").get((req, res) => {
  return res.status(200).json({
    code: 1,
    success: true,
    message: "/accounts Default Branch!",
  });
});
// Accounts Error Handling:
router
  .use((req, res, next) => {
    next(createError(404, "This /accounts directory does not exist!"));
  })
  .use((err, req, res, next) => {
    let errorStatus = err.status || 404;
    let errorMessage = err.message || "";
    return res.status(errorStatus).json({
      code: 0,
      success: false,
      message: errorMessage,
    });
  });
// Exports:
module.exports = router;
