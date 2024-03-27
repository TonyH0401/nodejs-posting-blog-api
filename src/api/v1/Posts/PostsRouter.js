const router = require("express").Router();
const createError = require("http-errors");
// Custom Utils:
// Custom Middlewares:
const {
  uploadBannerImg,
  createPost,
  getAllPost,
  getPostById,
  deletePostById,
  patchPostById,
} = require("./PostsMiddleware");
// Posts Router:
router.route("/post").post(uploadBannerImg, createPost).get();
router.route("/all").get(getAllPost);
router
  .route("/post/:postId")
  .get(getPostById)
  .patch(uploadBannerImg, patchPostById)
  .delete(deletePostById);
// Posts Error Handling:
router
  .use((req, res, next) => {
    next(createError(404, "This /posts directory does not exist!"));
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
