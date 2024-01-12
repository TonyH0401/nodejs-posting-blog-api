const sanitizeHtml = require("sanitize-html");
// Custom Utils:
// Sanitize HTML Tags Input:
/**
 * @param {Object} dirtyHtmlInput - The input is an object
 * @returns {Object} - The output is an object
 */
function sanitizeHtmlInput(dirtyHtmlInput) {
  for (const key in dirtyHtmlInput) {
    // deny every tags and attributes, only accept normal string
    let clean = sanitizeHtml(dirtyHtmlInput[key], {
      allowedTags: [],
      allowedAttributes: [],
    });
    if (clean != dirtyHtmlInput[key]) {
      return {
        success: false,
        message: `Header: ${key} with content ${dirtyHtmlInput[key]} is contaminated!`,
      };
    }
  }
  return {
    success: true,
    message: "Input is valid!",
  };
}
// Exports:
module.exports = { sanitizeHtmlInput };
