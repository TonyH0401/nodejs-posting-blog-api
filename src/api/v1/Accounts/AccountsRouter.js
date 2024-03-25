const router = require("express").Router();
const createError = require("http-errors");
// Custom Utils:
// Custom Middlewares:
const {
  createAccount,
  getAllAccounts,
  getAccountById,
  uploadAvatarImg,
  deleteAccountById,
  patchAccountById,
  removeAvatarById,
  changePassById,
  createAccountJwt,
  verifyAccountJwt,
} = require("./AccountsMiddleware");
// Accounts Router:
router.route("/account").post(uploadAvatarImg, createAccount).get();
router.route("/all").get(getAllAccounts);
router
  .route("/account/:accountId")
  .get(getAccountById)
  .patch(uploadAvatarImg, patchAccountById)
  .delete(deleteAccountById);
router.route("/account/:accountId/remove-avatar").delete(removeAvatarById);
router.route("/account/:accountId/change-password").post(changePassById);
router.route("/account/jwt/create").post(createAccountJwt);
router.route("/account/jwt/verify").post(verifyAccountJwt);
// router.route("/otp-verify").get().post();
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
