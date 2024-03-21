const createError = require("http-errors");
// Custom Utils:
const { toIsoDate } = require("../../../utils/dateFormatter");
const { hashOneWayPass } = require("../../../utils/dataEncrypter");
const { isStrongPass } = require("../../../utils/dataValidator");
// Custom Middlewares:
// Constant Declarations:
// Import Models:
const AccountsModel = require("./AccountsModel");
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
    // completed
    return res.status(200).json({
      code: 1,
      success: true,
      message: "New Account Created!",
      data: accountCreated,
    });
  } catch (error) {
    return next(createError(500, error.message));
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
