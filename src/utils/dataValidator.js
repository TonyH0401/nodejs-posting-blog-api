const validator = require("validator");
const zxcvbn = require("zxcvbn");
const jwt = require("jsonwebtoken");
// Custom Utils:
// Constant Declarations:
const jwtKey = process.env.JWT_ENCRYPTION_KEY;
// Validate Email Address:
function validateEmailAddress(emailInput) {
  const options = {
    host_whitelist: ["gmail.com", "outlook.com"],
  };
  return validator.isEmail(emailInput, options);
}
// Validate Strong Password:
function isStrongPass(barePassword) {
  /*  a strong password needs: 
        - 8 characters, 
        - num-alphabet, 
        - uppercase and lowercase 
        - contains special character 
   */
  const passResult = zxcvbn(barePassword);
  /*  password scoring lader:
        0, 1, 2 is weak and unacceptable; 
        3, 4 is strong and acceptable
   */
  // getting the score and the warning message
  const passScore = passResult.score;
  const passWarning = passResult.feedback.warning;
  // complete
  let result = { isStrong: true };
  if (passScore < 3) {
    result.isStrong = false;
    result.message = passWarning;
  }
  return result;
}
// Validate Date in UTC ISO-8601 Format
function validateDateUtcIso8601Format(dateInput) {
  const iso8601UtcPattern = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?Z$/;
  return iso8601UtcPattern.test(dateInput);
}
//
/**
 * @param {Object} payload - The input is an object called "payload", e.g { foo: "bar" }
 * @param {Number} expiresIn - The input is a number, e.g 1 hr * 60 min * 60 sec = 1 hour
 * @returns {Object} - The output is an object
 */
function createJwtToken(payload, expiresIn) {
  jwt.sign(
    payload,
    jwtKey,
    { expiresIn: expiresIn || "1h" },
    function (err, token) {
      if (err) {
        return {
          success: false,
          message: err.message,
        };
      }
      // console.log(token)
      return {
        success: true,
        message: token,
      };
    }
  );
}
// Exports:
module.exports = {
  validateEmailAddress,
  isStrongPass,
  validateDateUtcIso8601Format,
  createJwtToken,
};
