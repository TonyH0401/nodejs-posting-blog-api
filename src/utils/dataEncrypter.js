const CryptoJS = require("crypto-js");
const bcrypt = require("bcrypt");
// Custom Utils:
// Constant Declarations:
const encryptionKey = process.env.DATA_ENCRYPTION_KEY;
const saltRounds = 10;
// Create 1 Way Password Hash:
async function hashOneWayPass(barePassword) {
  let hashedPasword = "";
  await bcrypt.hash(barePassword, saltRounds).then((hashed) => {
    hashedPasword = hashed;
  });
  return hashedPasword;
}
// Encrypt Data:
/**
 * @param {Object} plainTextObject - The input is an object of plaintext
 * @returns {Object} - The output is an object of encrypted data
 */
function encryptDataAES(plainTextObject) {
  let cloned = { ...plainTextObject };
  for (const key in cloned) {
    if (cloned.hasOwnProperty(key)) {
      const encryptedValue = CryptoJS.AES.encrypt(
        cloned[key],
        encryptionKey
      ).toString();
      cloned[key] = encryptedValue;
    }
  }
  return cloned;
}
// Exports:
module.exports = { encryptDataAES, hashOneWayPass };
