const createError = require("http-errors");
const multer = require("multer");
const fse = require("fs-extra");
const path = require("path");
// Custom Utils:
// Custom Middlewares:
// Constant Declarations:
// Import Models:
const PostsModel = require("./PostsModel");
const AccountsModel = require("../Accounts/AccountsModel");
// Create Posts:
module.exports.createPost = async (req, res, next) => {
  const { postTitle, postContent, postAuthor } = req.body;
  try {
    // check if author exist
    const authorExist = await AccountsModel.findById(postAuthor);
    if (!authorExist) {
      return next(createError(404, `Author ID: ${postAuthor} Not Found`));
    }
    // create post
    const postNew = new PostsModel({
      postTitle: postTitle,
      postContent: postContent,
      postAuthor: postAuthor,
    });
    await postNew.save();
    // populate data for return response
    let postCreated = await postNew.populate("postAuthor");
    return res.status(200).json({
      code: 1,
      success: true,
      message: "New Post Created",
      data: postCreated,
    });
  } catch (error) {
    return next(createError(500, error.message));
  }
};
