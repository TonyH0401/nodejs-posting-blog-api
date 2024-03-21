const router = require("express").Router();
const createError = require("http-errors");
// Custom Utils:
// Custom Middlewares:
const {
  createAccount,
  getAllAccounts,
  getAccountById,
  uploadAvatarImg,
} = require("./AccountsMiddleware");
// Accounts Router:
router.route("/account").post(createAccount).get();
router.route("/all").get(getAllAccounts);
router.route("/account/:accountId").get(getAccountById).patch().delete();
router.route("/jwt-verify").get().post();
router.route("/otp-verify").get().post();
//
// router.route("/demo").post(uploadAvatarImg, (req, res) => {
//   return res.status(200).json({
//     fileExist: res.locals.fileExist,
//     fileName: res.locals.fileName || false,
//     filePath: res.locals.filePath || false,
//   });
// });
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
