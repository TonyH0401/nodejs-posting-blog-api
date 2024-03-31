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
    // because this version is the multiple layers version, we just need to get the general information
    const commentExist = await CommentsModel.findById(commentId);
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
// Delete Comment By Id:
/*
  because it has multiple layers, this will need a recursion deleteion,
  we defined something like that inside the pre hook
*/
module.exports.deleteCommentById = async (req, res, next) => {
  const { commentId } = req.params;
  try {
    /*
      because the comment is recursively saved, if we want to delete a point of a comment,
      we have to delete the children comments recursively, starts from the smallest one,
      after that, we can delete the current comment
    */
    const commentExist = await CommentsModel.findById(commentId).exec();
    if (!commentExist) {
      return next(createError(404, `Comment ID: ${commentId} Not Found`));
    }
    // this is where the pre hook for "deleteOne" starts
    await commentExist.deleteOne();
    // this method also works, it's the same as the one above, but this one is more redundant
    // await commentExist.deleteOne({ _id: commentExist._id });
    return res.status(200).json({
      code: 1,
      success: true,
      message: `Comment ID: ${commentId} Deleted`,
    });
  } catch (error) {
    return next(createError(500, error.message));
  }
};
// Patch Comment By Id: only allow you to change the comment content
module.exports.patchCommentById = async (req, res, next) => {
  const { commentId } = req.params;
  const { commentContent } = req.body;
  try {
    const payload = {
      commentContent: commentContent,
    };
    const commentUpdated = await CommentsModel.findByIdAndUpdate(
      commentId,
      payload,
      { new: true }
    );
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
// Partially Delete
/* 
  I want to create like reddit where the content maybe deleted but the tree is still there.
  So, I will "delete" the content and the author (maybe) but anything else will be find.
*/
// const commentUpdated = await CommentsModel.findByIdAndUpdate(commentId, {
//   commentAuthor: null,
//   commentContent: null,
// });
