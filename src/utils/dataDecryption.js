const CryptoJS = require("crypto-js");
// Data Encryption Key Environment Variable:
const encryptionKey = process.env.DATA_ENCRYPTION_KEY;
// Custom Utils:
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
module.exports = { decryptDataAES };
