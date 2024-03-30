const createError = require("http-errors");
// Custom Utils:
// Custom Middlewares:
// Constant Declarations:
// Import Models:
const CommentsV2Model = require("./CommentsV2Model");
const PostsModel = require("../Posts/PostsModel");
const AccountsModel = require("../Accounts/AccountsModel");
// Create Comment:
module.exports.createCommentV2 = async (req, res, next) => {
  const {
    commentPost,
    commentAuthor,
    commentContent,
    parent,
    accountRecipient,
  } = req.body;
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
      const parentExist = await CommentsV2Model.findById(parent);
      if (!parentExist) {
        return next(createError(404, `Parent Comment ID: ${parent} Not Found`));
      }
    }
    // check if accountRecipient exist
    if (accountRecipient) {
      const accountRecipientExist = await AccountsModel.findById(
        accountRecipient
      );
      if (!accountRecipientExist) {
        return next(
          createError(
            404,
            `Account Recipient ID: ${accountRecipient} Not Found`
          )
        );
      }
    }
    // create new comment
    let newComment = new CommentsV2Model({
      commentPost: commentPost,
      commentAuthor: commentAuthor,
      commentContent: commentContent,
      parent: parent ? parent : null,
      accountRecipient: accountRecipient ? accountRecipient : null,
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
// All the get comments need to be grouped together
// Get Comment By Id:
module.exports.getCommentById = async (req, res, next) => {
  const { commentV2Id } = req.params;
  try {
    // check if comment exist
    const commentExist = await CommentsV2Model.findById(commentV2Id);
    if (!commentExist) {
      return next(createError(404, `Comment ID: ${commentV2Id} Not Found`));
    }
    // check if it's a child comment and return or a parent comment with no children
    if (commentExist.children.length == 0) {
      return res.status(200).json({
        code: 1,
        success: true,
        message: `Comment ID: ${commentV2Id} Found`,
        data: commentExist,
      });
    }
  } catch (error) {
    return next(createError(500, error.message));
  }
};
// Get Comment By Post Id:
// Get Comment By Author Id:
