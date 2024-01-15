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
// Validate Date in UTC ISO-8601 Format
function validateDateUtcIso8601Format(dateInput) {
  const iso8601UtcPattern = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?Z$/;
  return iso8601UtcPattern.test(dateInput);
}
// Exports:
module.exports = {
  validateEmailAddress,
  validateStrongPassword,
  validateDateUtcIso8601Format,
};
