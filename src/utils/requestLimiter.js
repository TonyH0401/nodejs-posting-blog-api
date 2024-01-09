const { rateLimit } = require("express-rate-limit");
// 100 requests per 15 minutes:
const limiter100Req15Min = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    code: 0,
    success: false,
    limiter: true,
    message:
      "You have reached the request limit of 100, try again after 15 minutes",
  },
});
// 10 requests per 1 minute:
const limiter10Req1Min = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    code: 0,
    success: false,
    limiter: true,
    message:
      "You have reached the request limit of 10, try again after 1 minute",
  },
});
// Exports:
module.exports = { limiter100Req15Min, limiter10Req1Min };
