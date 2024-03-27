const createError = require("http-errors");
const multer = require("multer");
const fse = require("fs-extra");
const path = require("path");
// Custom Utils:
const {
  fileStorage,
  imageFileFilter,
  fileSize5mb,
} = require("../../../utils/multerOption");
const {
  cloudinaryUploader,
  cloudinaryDestroyer,
} = require("../../../utils/cloudinaryHandler");
// Custom Middlewares:
// Constant Declarations:
const postsImgTmpDir = "./public/PostsImgTmp/";
const postsImgDir = "./public/PostsImg/";
const bannerUpload = multer({
  storage: fileStorage(postsImgTmpDir),
  fileFilter: imageFileFilter,
  limits: fileSize5mb,
}).single("postBanner");
// Import Models:
const PostsModel = require("./PostsModel");
const AccountsModel = require("../Accounts/AccountsModel");
// Upload Banner Image Multer:
module.exports.uploadBannerImg = (req, res, next) => {
  bannerUpload(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      return res
        .status(404)
        .json({ code: 0, success: false, error: err.message });
    } else if (err) {
      return res
        .status(500)
        .json({ code: 0, success: false, error: err.message });
    }
    if (!req.file) {
      res.locals.fileExist = false;
    } else {
      res.locals.fileExist = true;
      res.locals.fileName = req.file.filename;
      res.locals.filePath = req.file.path;
    }
    return next();
  });
};
// Create Post:
module.exports.createPost = async (req, res, next) => {
  const { postTitle, postContent, postHeader, postAuthor } = req.body;
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
      postHeader: postHeader,
    });
    // save post to database
    await postNew.save();
    // create local post folder/dir
    await fse.ensureDir(postsImgDir + postNew._id);
    // check if there is an upload file
    if (res.locals.fileExist) {
      // create src and dest for post
      const src = postsImgTmpDir + res.locals.fileName;
      const dest = postsImgDir + postNew._id + "/" + res.locals.fileName;
      // move file from tempDir to mainDir
      await fse.move(src, dest);
      // update path for delete file, must be located here after moving file
      res.locals.filePath = dest;
      // upload to cloudinary
      const cloudinaryUploadResult = await cloudinaryUploader(dest);
      if (!cloudinaryUploadResult.success) {
        return next(createError(500, cloudinaryUploadResult.message));
      }
      // update cloudinary url to account
      postNew.postBanner.cloudinaryPubId =
        cloudinaryUploadResult.data.public_id;
      postNew.postBanner.cloudinaryLink =
        cloudinaryUploadResult.data.secure_url;
      await postNew.save();
    }
    // populate data for return response
    let postCreated = await postNew.populate("postAuthor");
    // complete
    return res.status(200).json({
      code: 1,
      success: true,
      message: "New Post Created",
      data: postCreated,
    });
  } catch (error) {
    return next(createError(500, error.message));
  } finally {
    // delete file from system using filePath
    if (res.locals.fileExist) fse.removeSync(res.locals.filePath);
  }
};
// Get All Post:
module.exports.getAllPost = async (req, res, next) => {
  try {
    const postAll = await PostsModel.find()
      .sort({
        createdAt: -1,
      })
      .populate({
        path: "postAuthor",
        select: {
          _id: 1,
          accountUserName: 1,
          accountAvatar: 1,
        },
      });
    // const populateAllPost = await postAll.;
    return res.status(200).json({
      code: 1,
      success: true,
      message: "All of Posts",
      counter: postAll.length,
      data: postAll,
    });
  } catch (error) {
    return next(createError(500, error.message));
  }
};
// Get Post By Id:
module.exports.getPostById = async (req, res, next) => {
  const { postId } = req.params;
  try {
    // instead of using .select() separately, you can use "select" inside populate
    const postExist = await PostsModel.findById(postId).populate({
      path: "postAuthor",
      select: {
        accountAvatar: 1,
        _id: 1,
        accountUserName: 1,
      },
    });
    if (!postExist) {
      return next(createError(404, `Post ID: ${postId} Not Found`));
    }
    return res.status(200).json({
      code: 1,
      success: true,
      message: `Post ID: ${postId} Found`,
      data: postExist,
    });
  } catch (error) {
    return next(createError(500, error.message));
  }
};
// Delete Post By Id:
module.exports.deletePostById = async (req, res, next) => {
  const { postId } = req.params;
  try {
    // check if post exist
    const postExist = await PostsModel.findById(postId);
    if (!postExist) {
      return next(createError(404, `Post ID: ${postId} Not Found`));
    }
    // delete in database
    const postDeleted = await PostsModel.findByIdAndDelete(postId);
    // delete in cloudinary
    if (postExist.postBanner.cloudinaryPubId) {
      const cloudinaryDeleteionResult = await cloudinaryDestroyer(
        postExist.postBanner.cloudinaryPubId
      );
      if (!cloudinaryDeleteionResult.success) {
        return next(createError(500, cloudinaryDeleteionResult.message));
      }
    }
    // delete dir in system
    fse.removeSync(postsImgDir + postId);
    // complete
    return res.status(200).json({
      code: 1,
      success: true,
      message: `Post Id ${postId} Deleted`,
      data: postDeleted,
    });
  } catch (error) {
    return next(createError(500, error.message));
  }
};
//
module.exports.patchPostById = async (req, res, next) => {
  const { postId } = req.params;
  const { postTitle, postHeader, postContent, postAuthor } = req.body;
  try {
    // check if author exist, if author need to be updated
    if (postAuthor) {
      const authorExist = await AccountsModel.findById(postAuthor);
      if (!authorExist) {
        return next(createError(404, `Author ID: ${postAuthor} Not Found`));
      }
    }
    // check if post exist
    const postExist = await PostsModel.findById(postId);
    if (!postExist) {
      return next(createError(404, `Post ID: ${postAuthor} Not Found`));
    }
    // update post
    postExist.postTitle = postTitle || postExist.postTitle;
    postExist.postHeader = postHeader || postExist.postHeader;
    postExist.postContent = postContent || postExist.postContent;
    postExist.postAuthor = postAuthor || postExist.postAuthor;
    // save updated information
    await postExist.save();
    // check if upload file exist
    if (res.locals.fileExist) {
      // create src and dest for post
      const src = postsImgTmpDir + res.locals.fileName;
      const dest = postsImgDir + postExist._id + "/" + res.locals.fileName;
      // move file from tempDir to mainDir
      await fse.move(src, dest);
      // update path for delete file, must be located here after moving file
      res.locals.filePath = dest;
      // upload to cloudinary
      const cloudinaryUploadResult = await cloudinaryUploader(dest);
      if (!cloudinaryUploadResult.success) {
        return next(createError(500, cloudinaryUploadResult.message));
      }
      // delete in cloudinary
      if (postExist.postBanner.cloudinaryPubId) {
        const cloudinaryDeleteionResult = await cloudinaryDestroyer(
          postExist.postBanner.cloudinaryPubId
        );
        if (!cloudinaryDeleteionResult.success) {
          return next(createError(500, cloudinaryDeleteionResult.message));
        }
      }
      // update cloudinary url to post
      postExist.postBanner.cloudinaryPubId =
        cloudinaryUploadResult.data.public_id;
      postExist.postBanner.cloudinaryLink =
        cloudinaryUploadResult.data.secure_url;
      await postExist.save();
    }
    const populatedPost = await postExist.populate({
      path: "postAuthor",
      select: {
        accountAvatar: 1,
        _id: 1,
        accountUserName: 1,
      },
    });
    return res.status(200).json({
      code: 1,
      success: true,
      message: `Post ID: ${postId} Updated`,
      data: populatedPost,
    });
  } catch (error) {
    return next(createError(500, error.message));
  } finally {
    // delete file from system using filePath
    if (res.locals.fileExist) await fse.remove(res.locals.filePath);
  }
};
