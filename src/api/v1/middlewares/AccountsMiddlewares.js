const createError = require("http-errors");
const { v4: uuidv4 } = require("uuid");
const moment = require("moment");
// Custom Middlewares, Utils:
const { sanitizeHtmlInput } = require("../../../utils/dataSanitizers");
const {
  validateEmailAddress,
  validateStrongPassword,
  validateDateUtcIso8601Format,
} = require("../../../utils/dataValidators");
const { encryptDataAES } = require("../../../utils/dataEncryption");
const { decryptDataAES } = require("../../../utils/dataDecryption");
// Import Models:
const AccountsModel = require("../models/AccountsModel");
// Input Data Exist Router:
function accountInputDataExist(req, res, next) {
  const { firstName, lastName, emailAddress, accountPassword, birthDay } =
    req.body;
  try {
    // check if data exist
    if (!firstName) return next(createError(400, "No firstName data!"));
    if (!lastName) return next(createError(400, "No lastName data!"));
    if (!emailAddress) return next(createError(400, "No emailAddress data!"));
    if (!accountPassword)
      return next(createError(400, "No accountPassword data!"));
    if (!birthDay) return next(createError(400, "No birthDay data!"));
    // continue if data exist
    return next();
  } catch (error) {
    return next(createError(500, error.message));
  }
}
// Input Data Validation Router:
function accountInputDataValidation(req, res, next) {
  const { firstName, lastName, emailAddress, accountPassword, birthDay } =
    req.body;
  try {
    // check for user's input sanitization
    let sanitizeResult = sanitizeHtmlInput({
      firstName: firstName,
      lastName: lastName,
      emailAddress: emailAddress,
      accountPassword: accountPassword,
      birthDay: birthDay,
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
    if (!validateDateUtcIso8601Format(birthDay))
      return next(
        createError(400, "Date Wrong Format, Need UTC ISO 8601 Format!")
      );
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
  const { firstName, lastName, emailAddress, accountPassword, birthDay } =
    req.body;
  try {
    // generate uuidv4
    const userId = uuidv4().slice(0, 12).replace("-", "");
    // encrypt data of each property
    const encryptedAccountData = encryptDataAES({
      firstName: firstName,
      lastName: lastName,
      emailAddress: emailAddress,
      accountPassword: accountPassword,
      birthDay: birthDay,
    });
    // create a new account
    let newAccount = new AccountsModel({
      firstName: encryptedAccountData.firstName,
      lastName: encryptedAccountData.lastName,
      emailAddress: encryptedAccountData.emailAddress,
      accountPassword: encryptedAccountData.accountPassword,
      birthDay: encryptedAccountData.birthDay,
      userId: userId,
    });
    let result = await newAccount.save();
    return res.status(200).json({
      code: 1,
      success: true,
      data: result,
    });
  } catch (error) {
    return next(createError(400, error.message));
  }
}
// Account Information Router:
async function getAccountByUserId(req, res, next) {
  const { userId } = req.params;
  try {
    // use .lean() to get POJOs, sacrifice mongoose .save(), getter and setter methods
    let accountExisted = await AccountsModel.findOne({ userId: userId }).lean();
    if (!accountExisted) {
      return next(createError(404, "Account does not exist!"));
    }
    // decrypt the data
    let decryptedData = decryptDataAES({
      firstName: accountExisted.firstName,
      lastName: accountExisted.lastName,
      emailAddress: accountExisted.emailAddress,
      accountPassword: accountExisted.accountPassword,
      birthDay: accountExisted.birthDay,
    });
    // clone the original data
    let cloned = { ...accountExisted };
    // update the cloned data with decrypted data
    cloned.firstName = decryptedData.firstName;
    cloned.lastName = decryptedData.lastName;
    cloned.emailAddress = decryptedData.emailAddress;
    cloned.accountPassword = decryptedData.accountPassword;
    cloned.birthDay = moment(decryptedData.birthDay).format("llll");
    return res.status(200).json({
      code: 1,
      success: true,
      data: cloned,
    });
  } catch (error) {
    return next(createError(500, error.message));
  }
}
// Account Update Information Router
async function updateAccountByUserId(req, res, next) {
  const { userId } = req.params;
  const { firstName, lastName, birthDay } = req.body;
  try {
    // sanitize data
    let sanitizedDataResult = sanitizeHtmlInput({
      firstName: firstName || "",
      lastName: lastName || "",
      birthDay: birthDay || "",
    });
    if (!sanitizedDataResult.success)
      return next(createError(400, sanitizedDataResult.message));
    // check date format
    if (!validateDateUtcIso8601Format(birthDay))
      return next(
        createError(400, "Date Wrong Format, Need UTC ISO 8601 Format!")
      );
    // check if account exist
    let accountExisted = await AccountsModel.findOne({ userId: userId });
    if (!accountExisted)
      return next(createError(404, "Account Not Found! Unable to Update!"));
    // encrypt new data
    let encryptNewData = encryptDataAES({
      firstName: firstName,
      lastName: lastName,
      birthDay: birthDay,
    });
    // update new encrypted data
    accountExisted.firstName = !firstName
      ? accountExisted.firstName
      : encryptNewData.firstName;
    accountExisted.lastName = !lastName
      ? accountExisted.lastName
      : encryptNewData.lastName;
    accountExisted.birthDay = !birthDay
      ? accountExisted.birthDay
      : encryptNewData.birthDay;
    let result = await accountExisted.save();
    return res.status(200).json({
      code: 1,
      success: true,
      data: result,
    });
  } catch (error) {
    return next(createError(500, error.message));
  }
}
// Exports:
module.exports = {
  accountInputDataExist,
  accountInputDataValidation,
  accountExistedByEmail,
  accountCreation,
  getAccountByUserId,
  updateAccountByUserId,
};
