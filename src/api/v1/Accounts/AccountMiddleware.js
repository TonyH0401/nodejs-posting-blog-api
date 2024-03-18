const createError = require("http-errors");
// Custom Utils:
// Custom Middlewares:
// Import Models:
const AccountsModel = require("./AccountsModel");
// Create Account:
module.exports.createAccount = async (req, res, next) => {
  const { accountName, accountPassword, accountEmail } = req.body;
  try {
    let accountNew = new AccountsModel({
      accountName: accountName || "",
      accountPassword: accountPassword || "123",
      accountEmail: accountEmail || "",
    });
    const accountCreated = await accountNew.save();
    return res.status(200).json({
      code: 1,
      success: true,
      message: "Account Created!",
      data: accountCreated,
    });
  } catch (error) {
    return next(createError(500, error.message));
  }
};
// Get All Accounts:
module.exports.getAllAccounts = async (req, res, next) => {
  try {
    const accountAll = await AccountsModel.find({});
    return res.status(200).json({
      code: 1,
      success: true,
      message: "All Accounts!",
      counter: accountAll.length,
      data: accountAll,
    });
  } catch (error) {
    return next(createError(500, error.message));
  }
};
