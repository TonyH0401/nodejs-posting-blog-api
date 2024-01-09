const createError = require("http-errors");
// Custom Middleware, Utils:
const { toSanitizeHtml } = require("../../../utils/dataSanitizers");
const {
  validateEmailAddress,
  validateStrongPassword,
} = require("../../../utils/dataValidators");
// Register:
function registerAccount(req, res, next) {
  const { email, password } = req.body;
  if (!validateEmailAddress(email))
    return next(createError(400, "Invalid Email Address!"));
  const validateStrongPasswordResult = validateStrongPassword(password);
  if (validateStrongPasswordResult.score < 3)
    return next(createError(400, validateStrongPasswordResult.message));
  return next();
}
// Exports:
module.exports = { registerAccount };
