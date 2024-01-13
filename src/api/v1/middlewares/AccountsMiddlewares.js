const createError = require("http-errors");
const { v4: uuidv4 } = require("uuid");
// Custom Middlewares, Utils:
const { sanitizeHtmlInput } = require("../../../utils/dataSanitizers");
const {
  validateEmailAddress,
  validateStrongPassword,
} = require("../../../utils/dataValidators");
const { encryptDataAES } = require("../../../utils/dataEncryption");
const { decryptDataAES } = require("../../../utils/dataDecryption");
// Import Models:
const AccountsModel = require("../models/AccountsModel");
// Input Data Exist Router:
function accountInputDataExist(req, res, next) {
  const { firstName, lastName, emailAddress, accountPassword } = req.body;
  try {
    // check if data exist
    if (!firstName) return next(createError(400, "No firstName data!"));
    if (!lastName) return next(createError(400, "No lastName data!"));
    if (!emailAddress) return next(createError(400, "No emailAddress data!"));
    if (!accountPassword)
      return next(createError(400, "No accountPassword data!"));
    // continue if data exist
    return next();
  } catch (error) {
    return next(createError(500, error.message));
  }
}
// Input Data Validation Router:
function accountInputDataValidation(req, res, next) {
  const { firstName, lastName, emailAddress, accountPassword } = req.body;
  try {
    // check for user's input sanitization
    let sanitizeResult = sanitizeHtmlInput({
      firstName: firstName,
      lastName: lastName,
      emailAddress: emailAddress,
      accountPassword: accountPassword,
    });
    if (!sanitizeResult.success) {
      return next(createError(400, sanitizeResult.message));
    }
    // check email is valid format, only support @gmail and @outlook
    if (!validateEmailAddress(emailAddress))
      return next(createError(400, "Invalid Email Address Format!"));
    // check if password is strong enough
    const validateStrongPasswordResult =
      validateStrongPassword(accountPassword);
    if (validateStrongPasswordResult.score < 3)
      return next(createError(400, validateStrongPasswordResult.message));
    // continue next if pass all
    return next();
  } catch (error) {
    return next(createError(500, error.message));
  }
}
// Acount Existed Check Router:
async function accountExistedByEmail(req, res, next) {
  const { emailAddress } = req.body;
  try {
    let accountExisted = await AccountsModel.findOne({
      emailAddress: emailAddress,
    });
    if (accountExisted) {
      return next(createError(400, `The account: ${emailAddress} Is Used!`));
    }
    return next();
  } catch (error) {
    return next(createError(500, error.message));
  }
}
// Account Creation Router:
async function accountCreation(req, res, next) {
  const { firstName, lastName, emailAddress, accountPassword } = req.body;
  try {
    // generate uuidv4
    const userId = uuidv4().slice(0, 12).replace("-", "");
    // encrypt data of each property
    const temp = encryptDataAES({
      firstName: firstName,
      lastName: lastName,
      emailAddress: emailAddress,
      accountPassword: accountPassword,
    });
    console.log(temp);
    const decrypted = decryptDataAES(temp);
    console.log(decrypted);
    // create a new account
    // let newAccount = new AccountsModel({
    //   firstName: firstName,
    //   lastName: lastName,
    //   emailAddress: emailAddress,
    //   accountPassword: accountPassword,
    //   userId: userId,
    // });
    // let result = await newAccount.save();
    return res.status(200).json({
      code: 1,
      success: true,
      data: result,
    });
  } catch (error) {
    return next(createError(400, error.message));
  }
}
// Exports:
module.exports = {
  accountInputDataExist,
  accountInputDataValidation,
  accountExistedByEmail,
  accountCreation,
};
