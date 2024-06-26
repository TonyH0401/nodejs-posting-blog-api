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
module.exports.getCommentV2ById = async (req, res, next) => {
  const { commentV2Id } = req.params;
  try {
    // check if comment exist
    const commentExist = await CommentsV2Model.findById(commentV2Id)
      .populate({
        path: "commentAuthor",
        select: {
          _id: 1,
          accountAvatar: 1,
          accountUserName: 1,
        },
      })
      .populate({
        path: "accountRecipient",
        select: {
          _id: 1,
          accountAvatar: 1,
          accountUserName: 1,
        },
      });
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
    // return the parent comment with the list of all its children in creation asc order
    const populateParent = await commentExist.populate({
      path: "children",
      populate: [
        {
          path: "commentAuthor",
          select: {
            _id: 1,
            accountAvatar: 1,
            accountUserName: 1,
          },
        },
        {
          path: "accountRecipient",
          select: {
            _id: 1,
            accountAvatar: 1,
            accountUserName: 1,
          },
        },
      ],
      options: {
        sort: { createdAt: 1 },
      },
    });
    return res.status(200).json({
      code: 1,
      success: true,
      message: `Parent Comment ID: ${commentV2Id} Found`,
      data: populateParent,
    });
  } catch (error) {
    return next(createError(500, error.message));
  }
};
// Get Comment By Post Id:
module.exports.getCommentV2ByPostId = async (req, res, next) => {
  const { postId } = req.params;
  try {
    const postExist = await PostsModel.findById(postId);
    if (!postExist) {
      return next(createError(404, `Post ID: ${postId} Not Found`));
    }
    // get only parent comments
    const parentCommentByPostId = await CommentsV2Model.find({
      commentPost: postId,
      parent: null,
      accountRecipient: null,
    })
      .populate({
        path: "commentAuthor",
        select: {
          _id: 1,
          accountAvatar: 1,
          accountUserName: 1,
        },
      })
      .populate({
        path: "children",
        populate: [
          {
            path: "commentAuthor",
            select: {
              _id: 1,
              accountAvatar: 1,
              accountUserName: 1,
            },
          },
          {
            path: "accountRecipient",
            select: {
              _id: 1,
              accountAvatar: 1,
              accountUserName: 1,
            },
          },
        ],
        options: {
          // sorting inside the children comments
          sort: {
            createdAt: 1,
          },
        },
      })
      .sort({
        // sorting outside the parent comments
        createdAt: 1,
      });
    return res.status(200).json({
      code: 1,
      success: true,
      message: `Comments for Post ID: ${postId} Found`,
      counter: parentCommentByPostId.length,
      data: parentCommentByPostId,
    });
  } catch (error) {
    return next(createError(500, error.message));
  }
};
// Get Comment By Author Id:
module.exports.getCommentV2ByAuthorId = async (req, res, next) => {
  const { authorId } = req.params;
  try {
    const authorExist = await AccountsModel.findById(authorId);
    if (!authorExist) {
      return next(createError(404, `Author ID: ${authorId} Not Found`));
    }
    const authorComments = await CommentsV2Model.find({
      commentAuthor: authorId,
    }).sort({
      createdAt: 1,
    });
    return res.status(200).json({
      code: 1,
      success: true,
      message: `Comments for Author ID: ${authorId} Found`,
      counter: authorComments.length,
      data: authorComments,
    });
  } catch (error) {
    return next(createError(500, error.message));
  }
};
// Delete Comment By Id:
module.exports.deleteCommentV2ById = async (req, res, next) => {
  const { commentV2Id } = req.params;
  try {
    // check if the parent exist
    const commentExist = await CommentsV2Model.findById(commentV2Id);
    if (!commentExist) {
      return next(createError(404, `Comment ID: ${commentV2Id} Not Found`));
    }
    // if parent property is null -> it's a parent, if it isn't null it's a child comment
    if (commentExist.parent != null) {
      const parentId = commentExist.parent;
      // the delete the child comment without effect other child comments
      await CommentsV2Model.findByIdAndDelete(commentV2Id);
      // remove the child reference in the parent
      await CommentsV2Model.updateOne(
        { _id: parentId },
        { $pull: { children: commentV2Id } }
      );
    } else {
      // remove all the children comment
      await CommentsV2Model.deleteMany({ _id: { $in: commentExist.children } });
      // remove the parent comment
      await CommentsV2Model.findByIdAndDelete(commentV2Id);
    }
    return res.status(200).json({
      code: 1,
      success: true,
      message: `Comment ID: ${commentV2Id} Deleted`,
      data: commentExist,
    });
  } catch (error) {
    return next(createError(500, error.message));
  }
};
// Patch Comment By Id:
module.exports.patchCommentV2ById = async (req, res, next) => {
  const { commentV2Id } = req.params;
  const { commentContent } = req.body;
  try {
    const payload = {
      commentContent: commentContent,
    };
    const commentUpdated = await CommentsV2Model.findByIdAndUpdate(
      commentV2Id,
      payload
    );
    if (!commentUpdated) {
      return next(createError(404, `Comment ID: ${commentV2Id} Not Found`));
    }
    return res.status(200).json({
      code: 1,
      success: true,
      message: `Comment ID: ${commentV2Id} Updated`,
      data: commentUpdated,
    });
  } catch (error) {
    return next(createError(500, error.message));
  }
};
//
module.exports.commentPagination = async (req, res, next) => {
  const page = req.query.page || 0;
  const docPerPage = 3;
  // const {}
  try {
    const comments = await CommentsV2Model.find()
      .sort({ createdAt: 1 })
      .skip(page * docPerPage)
      .limit(docPerPage);
    return res.status(200).json({
      code: 1,
      success: true,
      message: `Total of ${comments.length} comment for page ${page} found`,
      data: comments,
    });
  } catch (error) {
    return next(createError(500, error.message));
  }
};
