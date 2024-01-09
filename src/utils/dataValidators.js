const validator = require("validator");
const zxcvbn = require("zxcvbn");
// Custom Utils:
// Validate Email Address:
function validateEmailAddress(emailInput) {
  const options = {
    host_whitelist: ["gmail.com", "outlook.com"],
  };
  return validator.isEmail(emailInput, options);
}
// Validate Strong Password:
function validateStrongPassword(passwordInput) {
  // password need 8 characters, num-alphabet, uppercase, lowercase and contains special character
  const passValidationResult = zxcvbn(passwordInput);
  // 0, 1, 2 is weak and unacceptable; 3, 4 is strong and acceptable
  const passScore = passValidationResult.score;
  const passWarningSuggest = [
    passValidationResult.feedback.warning,
    passValidationResult.feedback.suggestions.join(" "),
  ].join("; ");
  return {
    score: passScore,
    message: passWarningSuggest,
  };
}
// Exports:
module.exports = { validateEmailAddress, validateStrongPassword };
