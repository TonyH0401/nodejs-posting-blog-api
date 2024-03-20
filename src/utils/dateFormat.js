const moment = require("moment");
// Constant for ISO 8061 Date Format:
const regex = /^\d{4}\/\d{2}\/\d{2}$/;
function toUtcDate(dateInput) {
  // check if is ISO 8061 format
  if (!regex.test(dateInput)) {
    return false;
  }
  // convert to UTC date format
  return moment.utc(dateInput).format;
}
// Exports:
module.exports = { toUtcDate };
