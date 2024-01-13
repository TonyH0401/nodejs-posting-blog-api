const router = require("express").Router();
const createError = require("http-errors");
// Custom Middlewares, Utils:
const {
  accountInputDataValidation,
  accountInputDataExist,
  accountExistedByEmail,
  accountCreation,
  getAccountByUserId,
  updateAccountByUserId,
} = require("../middlewares/AccountsMiddlewares");
// Import Models:
// Accounts Routers:
// /api/v1/accounts/register
router
  .route("/register")
  .post(
    accountInputDataExist,
    accountInputDataValidation,
    accountExistedByEmail,
    accountCreation
  );
// /api/v1/accounts/account/:userId
router
  .route("/account/:userId")
  .get(getAccountByUserId)
  .patch(updateAccountByUserId);
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
