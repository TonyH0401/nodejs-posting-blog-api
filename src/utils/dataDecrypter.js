const CryptoJS = require("crypto-js");
const bcrypt = require("bcrypt");
// Custom Utils:
// Constant Declarations:
const encryptionKey = process.env.DATA_ENCRYPTION_KEY;
const saltRounds = 10;
// (Decrypt) Compare 1 Way Bcrypt Password:
async function isMatchHashedBcryptPass(barePassword, hashedPassword) {
  return await bcrypt.compare(barePassword, hashedPassword);
}
// Decrypt Data:
/**
 * @param {Object} encryptedTextObject - The input is an encrypted data object
 * @returns {Object} - The output is an plaintext object
 */
function decryptDataAES(encryptedTextObject) {
  let cloned = { ...encryptedTextObject };
  for (const key in cloned) {
    if (cloned.hasOwnProperty(key)) {
      const decryptedValue = CryptoJS.AES.decrypt(
        cloned[key],
        encryptionKey
      ).toString(CryptoJS.enc.Utf8);
      cloned[key] = decryptedValue;
    }
  }
  return cloned;
}
// Exports:
module.exports = { decryptDataAES, isMatchHashedBcryptPass };
