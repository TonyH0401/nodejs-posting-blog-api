const createError = require("http-errors");
const multer = require("multer");
const fse = require("fs-extra");
const path = require("path");
// Custom Utils:
const { toIsoDate } = require("../../../utils/dateFormatter");
const { hashOneWayPass } = require("../../../utils/dataEncrypter");
const { isMatchHashedBcryptPass } = require("../../../utils/dataDecrypter");
const { isStrongPass } = require("../../../utils/dataValidator");
const {
  fileStorage,
  imageFileFilter,
  fileSize5mb,
} = require("../../../utils/multerOption");
const {
  cloudinaryUploader,
  cloudinaryDestroyer,
} = require("../../../utils/cloudinaryHandler");
const { createJwt, verifyJwt } = require("../../../utils/dataValidator");
// Custom Middlewares:
// Constant Declarations:
const accountsImgTmpDir = "./public/AccountsImgTmp/";
const accountsImgDir = "./public/AccountsImg/";
const avatarUpload = multer({
  storage: fileStorage(accountsImgTmpDir),
  fileFilter: imageFileFilter,
  limits: fileSize5mb,
}).single("accountAvatar");
// Import Models:
const AccountsModel = require("./AccountsModel");
// Upload Avatar Image Multer:
module.exports.uploadAvatarImg = (req, res, next) => {
  avatarUpload(req, res, (err) => {
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
// Create Account:
module.exports.createAccount = async (req, res, next) => {
  // get the data from the req.body
  const {
    accountFullName,
    accountUserName,
    accountPassword,
    accountEmail,
    accountGender,
    accountBirthDay,
  } = req.body;
  try {
    // check the password strength
    const passStrength = isStrongPass(accountPassword);
    if (!passStrength.isStrong) {
      return next(createError(500, passStrength.message));
    }
    // create a new account
    let accountNew = new AccountsModel({
      accountFullName: accountFullName,
      accountUserName: accountUserName,
      accountPassword: await hashOneWayPass(accountPassword),
      accountEmail: accountEmail,
      accountGender: accountGender,
      accountBirthDay: toIsoDate(accountBirthDay),
    });
    // save new account to database
    const accountCreated = await accountNew.save();
    // create account folder/dir
    await fse.ensureDir(accountsImgDir + accountCreated._id);
    // check if there is an upload file
    if (res.locals.fileExist) {
      // create src and dest for account
      const src = accountsImgTmpDir + res.locals.fileName;
      const dest =
        accountsImgDir + accountCreated._id + "/" + res.locals.fileName;
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
      accountCreated.accountAvatar.cloudinaryPubId =
        cloudinaryUploadResult.data.public_id;
      accountCreated.accountAvatar.cloudinaryLink =
        cloudinaryUploadResult.data.secure_url;
      await accountCreated.save();
    }
    // completed
    return res.status(200).json({
      code: 1,
      success: true,
      message: "New Account Created!",
      data: accountCreated,
    });
  } catch (error) {
    return next(createError(500, error.message));
  } finally {
    // delete file from system using filePath
    if (res.locals.fileExist) fse.removeSync(res.locals.filePath);
  }
};
// Get All Accounts:
module.exports.getAllAccounts = async (req, res, next) => {
  try {
    const accountsAll = await AccountsModel.find({}).sort({
      accountFullName: 1,
    });
    return res.status(200).json({
      code: 1,
      success: true,
      message: "All Accounts!",
      counter: accountsAll.length,
      data: accountsAll,
    });
  } catch (error) {
    return next(createError(500, error.message));
  }
};
// Get Account By Id:
module.exports.getAccountById = async (req, res, next) => {
  const { accountId } = req.params;
  try {
    const accountExist = await AccountsModel.findById(accountId);
    if (!accountExist) {
      return res.status(404).json({
        code: 0,
        success: false,
        message: `Account ID: ${accountId} Not Found`,
      });
    }
    return res.status(200).json({
      code: 1,
      success: true,
      message: `Account ID: ${accountId} Found`,
      data: accountExist,
    });
  } catch (error) {
    return next(createError(500, error.message));
  }
};
// Delete Account By Id:
module.exports.deleteAccountById = async (req, res, next) => {
  const { accountId } = req.params;
  try {
    const accountExist = await AccountsModel.findById(accountId);
    if (!accountExist) {
      return res.status(404).json({
        code: 0,
        success: false,
        message: `Account ID: ${accountId} Not Found!`,
      });
    }
    // delete in database
    const accountDeleted = await AccountsModel.findByIdAndDelete(accountId);
    // delete in cloudinary
    if (accountExist.accountAvatar.cloudinaryPubId) {
      const cloudinaryDeleteionResult = await cloudinaryDestroyer(
        accountExist.accountAvatar.cloudinaryPubId
      );
      if (!cloudinaryDeleteionResult.success) {
        return next(createError(500, cloudinaryDeleteionResult.message));
      }
    }
    // delete dir in system
    fse.removeSync(accountsImgDir + accountId);
    return res.status(200).json({
      code: 1,
      success: true,
      message: `Account Id ${accountId} Deleted`,
      data: accountDeleted,
    });
  } catch (error) {
    return next(createError(500, error.message));
  }
};
//
module.exports.patchAccountById = async (req, res, next) => {
  const { accountId } = req.params;
  const {
    accountFullName,
    accountUserName,
    accountEmail,
    accountGender,
    accountBirthDay,
  } = req.body;
  try {
    // find account
    const accountExist = await AccountsModel.findById(accountId);
    if (!accountExist) {
      return next(createError(404, `Account ID: ${accountId} Not Found`));
    }
    // update account
    accountExist.accountFullName =
      accountFullName || accountExist.accountFullName;
    accountExist.accountUserName =
      accountUserName || accountExist.accountUserName;
    accountExist.accountEmail = accountEmail || accountExist.accountEmail;
    accountExist.accountGender = accountGender || accountExist.accountGender;
    accountExist.accountBirthDay =
      toIsoDate(accountBirthDay) || accountExist.accountBirthDay;
    let accountUpdated = await accountExist.save();
    // check if upload file exist
    if (res.locals.fileExist) {
      // create src and dest for account
      const src = accountsImgTmpDir + res.locals.fileName;
      const dest =
        accountsImgDir + accountExist._id + "/" + res.locals.fileName;
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
      if (accountExist.accountAvatar.cloudinaryPubId) {
        const cloudinaryDeleteionResult = await cloudinaryDestroyer(
          accountExist.accountAvatar.cloudinaryPubId
        );
        if (!cloudinaryDeleteionResult.success) {
          return next(createError(500, cloudinaryDeleteionResult.message));
        }
      }
      // update cloudinary url to account
      accountUpdated.accountAvatar.cloudinaryPubId =
        cloudinaryUploadResult.data.public_id;
      accountUpdated.accountAvatar.cloudinaryLink =
        cloudinaryUploadResult.data.secure_url;
      await accountUpdated.save();
    }
    return res.status(200).json({
      code: 1,
      success: true,
      message: `Account ID: ${accountId} Updated`,
      data: accountUpdated,
    });
  } catch (error) {
    return next(createError(500, error.message));
  } finally {
    // delete file from system using filePath
    if (res.locals.fileExist) await fse.remove(res.locals.filePath);
  }
};
// Remove Avatar By Id:
module.exports.removeAvatarById = async (req, res, next) => {
  const { accountId } = req.params;
  try {
    const accountExist = await AccountsModel.findById(accountId);
    if (!accountExist) {
      return next(createError(404, `Account ID: ${accountId} Not Found`));
    }
    // delete in cloudinary
    if (accountExist.accountAvatar.cloudinaryPubId) {
      const cloudinaryDeleteionResult = await cloudinaryDestroyer(
        accountExist.accountAvatar.cloudinaryPubId
      );
      if (!cloudinaryDeleteionResult.success) {
        return next(createError(500, cloudinaryDeleteionResult.message));
      }
    }
    // update url in database
    accountExist.accountAvatar.cloudinaryPubId = "";
    accountExist.accountAvatar.cloudinaryLink = "";
    await accountExist.save();
    return res.status(200).json({
      code: 1,
      success: true,
      message: `Account ID: ${accountId} Remove Avatar`,
      data: accountExist,
    });
  } catch (error) {
    return next(createError(500, error.message));
  }
};
// Change Password By Id:
module.exports.changePassById = async (req, res, next) => {
  const { accountId } = req.params;
  const { accountPasswordOld, accountPasswordNew1, accountPasswordNew2 } =
    req.body;
  try {
    const accountExist = await AccountsModel.findById(accountId);
    if (!accountExist) {
      return next(createError(404, `Account ID: ${accountId} Not Found`));
    }
    // check if old password is correct
    const passwordMatchResult = await isMatchHashedBcryptPass(
      accountPasswordOld,
      accountExist.accountPassword
    );
    if (!passwordMatchResult) {
      return next(createError(404, "Wrong Password"));
    }
    // check if both value is null
    if (accountPasswordNew1 == null && accountPasswordNew2 == null) {
      return next(createError(500, "Value cannot be null"));
    }
    // check if both value is empty
    if (accountPasswordNew1.length == 0 && accountPasswordNew2.length == 0) {
      return next(createError(500, "Value cannot be empty"));
    }
    // check if 2 new password is the same
    if (accountPasswordNew1 != accountPasswordNew2) {
      return next(createError(500, "New passwords does not match"));
    }
    // check if new password is old password
    if (accountPasswordOld == accountPasswordNew1) {
      return next(
        createError(500, "New password cannot be the same as old password")
      );
    }
    // check the password strength
    const passStrength = isStrongPass(accountPasswordNew1);
    if (!passStrength.isStrong) {
      return next(createError(500, passStrength.message));
    }
    accountExist.accountPassword = await hashOneWayPass(accountPasswordNew1);
    await accountExist.save();
    return res.status(200).json({
      code: 1,
      success: true,
      message: `Account ID ${accountId} Changed Password`,
      data: accountExist,
    });
  } catch (error) {
    return next(createError(500, error.message));
  }
};
// Create Account JWT:
module.exports.createAccountJwt = async (req, res, next) => {
  const { accountId } = req.body;
  /*  I have to put this variable here because its data is assigned inside the try/catch
      but it's used outside of try/catch.
      Any variables declared and assigned data inside try/catch is out of scope once it's used
      outside of the try/catch */
  let accountExist;
  try {
    // check if account exist
    accountExist = await AccountsModel.findById(accountId);
    if (!accountExist) {
      return next(createError(404, `Account ID: ${accountId} Not Found`));
    }
  } catch (error) {
    return next(createError(500, error.message));
  }
  // prepare payload
  const payload = {
    accountId: accountId,
    accountEmail: accountExist.accountEmail,
  };
  // set expiration date to 12h
  const expiresIn = 12 * 60 * 60;
  // const expiresIn = 5 * 60;
  createJwt(payload, expiresIn, (err, token) => {
    if (err) {
      return next(createError(500, err.message));
    } else {
      const jwtToken = token;
      return res.status(200).json({
        code: 1,
        success: true,
        message: `JWT for Account ID: ${accountId} created`,
        data: jwtToken,
      });
    }
  });
};
// Verify Jwt Account:
module.exports.verifyAccountJwt = async (req, res, next) => {
  const { accountJwt } = req.body;
  verifyJwt(accountJwt, async (err, decoded) => {
    if (err) {
      return next(createError(500, err.message));
    } else {
      const decodedPayload = decoded;
      try {
        const accountUpdated = await AccountsModel.findByIdAndUpdate(
          decodedPayload.accountId,
          { isValidated: true },
          { new: true }
        );
        if (!accountUpdated) {
          return next(createError(404, `Account ID Not Found to Update`));
        }
        return res.status(200).json({
          code: 1,
          success: true,
          message: "Account JWT Verified",
          data: accountUpdated,
        });
      } catch (error) {
        return next(createError(500, error.message));
      }
    }
  });
};
