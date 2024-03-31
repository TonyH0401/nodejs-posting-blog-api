const router = require("express").Router();
const createError = require("http-errors");
// Custom Utils:
// Custom Middlewares:
const {
  createComment,
  getCommentById,
  deleteCommentById,
} = require("./CommentsMiddleware");
// Comments Router:
router.route("/comment").post(createComment).get();
router
  .route("/comment/:commentId")
  .get(getCommentById)
  .patch()
  .delete(deleteCommentById);
// Comments Error Handling:
router
  .use((req, res, next) => {
    next(createError(404, "This /comments directory does not exist!"));
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
