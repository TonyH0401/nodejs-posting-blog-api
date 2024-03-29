const createError = require("http-errors");
// Custom Utils:
// Custom Middlewares:
// Constant Declarations:
// Import Models:
const CommentsModel = require("./CommentsModel");
const PostsModel = require("../Posts/PostsModel");
const AccountsModel = require("../Accounts/AccountsModel");
// Create Comment:
module.exports.createComment = async (req, res, next) => {
  const { commentPost, commentAuthor, commentContent, parent } = req.body;
  try {
    // check if post exist
    const postExist = await PostsModel.findById(commentPost);
    if (!postExist) {
      return next(createError(404, `Post ID: ${commentPost} Not Found`));
    }
    // check if author exist:
    const authorExist = await AccountsModel.findById(commentAuthor);
    if (!authorExist) {
      return next(createError(404, `Account ID: ${commentAuthor} Not Found`));
    }
    // check if parent exist
    if (parent) {
      const parentExist = await CommentsModel.findById(parent);
      if (!parentExist) {
        return next(createError(404, `Parent Comment ID: ${parent} Not Found`));
      }
    }
    // create new comment
    let newComment = new CommentsModel({
      commentPost: commentPost,
      commentAuthor: commentAuthor,
      commentContent: commentContent,
      parent: parent ? parent : null,
    });
    // save to database
    await newComment.save();
    // complete
    return res.status(200).json({
      code: 1,
      success: true,
      message: `New Comment Created`,
      data: newComment,
    });
  } catch (error) {
    return next(createError(500, error.message));
  }
};
// Get Comment By Id:
module.exports.getCommentById = async (req, res, next) => {
  const { commentId } = req.params;
  try {
    const commentExist = await CommentsModel.findById(commentId)
      .populate("parent")
      .populate("children");
    if (!commentExist) {
      return next(createError(404, `Comment ID: ${commentId} Not Found`));
    }
    return res.status(200).json({
      code: 1,
      success: true,
      message: `Comment ID : ${commentId} Found`,
      data: commentExist,
    });
  } catch (error) {
    return next(createError(500, error.message));
  }
};
// "Delete" Comment By Id:
/* 
  I want to create like reddit where the content maybe deleted but the tree is still there.
  So, I will delete the content and the author but anything else will be find.
*/
module.exports.partialDeleteCommentById = async (req, res, next) => {
  const { commentId } = req.params;
  try {
    const commentUpdated = await CommentsModel.findByIdAndUpdate(commentId, {
      commentAuthor: null,
      commentContent: null,
    });
    if (!commentUpdated) {
      return next(createError(404, `Comment ID: ${commentId} Not Found`));
    }
    return res.status(200).json({
      code: 1,
      success: true,
      message: `Comment ID: ${commentId} Deleted`,
      data: commentUpdated,
    });
  } catch (error) {
    return next(createError(500, error.message));
  }
};
// Patch Comment By Id:mm
module.exports.patchCommentById = async (req, res, next) => {
  const { commentId } = req.params;
  const {} = req.body;
  try {
  } catch (error) {
    return next(createError(500, error.message));
  }
};
