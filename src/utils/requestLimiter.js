const { rateLimit } = require("express-rate-limit");
// Limit 100 Requests per 15 Minutes:
const limit100Req15Min = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    code: 0,
    success: false,
    limiter: true,
    message:
      "You have reached the request limit of 100, try again after 15 minutes!",
  },
});
// Limit 10 Requests per 5 Minutes:
const limit10Req5Min = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    code: 0,
    success: false,
    limiter: true,
    message:
      "You have reached the request limit of 10, try again after 5 minutes!",
  },
});
// Exports:
module.exports = { limit100Req15Min, limit10Req5Min };
/* the message section of rate-limiter can take in a differen range of values
include json format, or html components, you can see it in the docs
here: https://express-rate-limit.mintlify.app/reference/configuration#message
or in my github here: https://github.com/TonyH0401/nodejs-myrecipe-noting-frontend/blob/master/app.js
 */
