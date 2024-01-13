const CryptoJS = require("crypto-js");
// Data Encryption Key Environment Variable:
const encryptionKey = process.env.DATA_ENCRYPTION_KEY;
// Custom Utils:
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
module.exports = { encryptDataAES };
