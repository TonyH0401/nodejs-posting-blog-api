const sanitizeHtml = require("sanitize-html");
// Custom Utils:
// Sanitize HTML Tags:
function toSanitizeHtml(dirtyHtmlInput) {
  return sanitizeHtml(dirtyHtmlInput);
}
// Exports:
module.exports = { toSanitizeHtml };
