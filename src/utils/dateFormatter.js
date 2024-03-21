const moment = require("moment");
// Constant Declarations:
// constant for YYYY/MM/DD date format:
const regex = /^\d{4}\/\d{2}\/\d{2}$/;
// Convert YYYY/MM/DD to ISO Date Format:
function toIsoDate(dateInput) {
  // check if is ISO 8061 format
  if (!regex.test(dateInput)) {
    return false;
  }
  return moment(dateInput, "YYYY/MM/DD").toISOString();
}
// Exports:
module.exports = { toIsoDate };
