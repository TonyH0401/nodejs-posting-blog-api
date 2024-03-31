const router = require("express").Router();
const createError = require("http-errors");
// Custom Utils:
// Custom Middlewares:
const {
  createCommentV2,
  getCommentV2ById,
  getCommentV2ByPostId,
  getCommentV2ByAuthorId,
} = require("./CommentsV2Middleware");
// Comments Router:
router.route("/commentV2").post(createCommentV2).get();
router.route("/commentV2/:commentV2Id").get(getCommentV2ById).patch().delete();
router.route("/post/:postId").get(getCommentV2ByPostId).patch().delete();
router.route("/author/:authorId").get(getCommentV2ByAuthorId).patch().delete();
// Comments Error Handling:
router
  .use((req, res, next) => {
    next(createError(404, "This /commentsV2 directory does not exist!"));
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
