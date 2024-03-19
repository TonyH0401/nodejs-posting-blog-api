const morgan = require("morgan");
// Request Logger Mode Tiny:
const reqLoggerTiny = morgan("tiny");
// Request Logger Mode Developer:
const reqLoggerDev = morgan("dev");
// Request Logger Mode Developer Extra 1:
/* this mode accepts error request only, 
they are requests that have a code above 400. */
const reqLoggerDevErrOnly = morgan("dev", {
  skip: function (req, res) {
    return res.statusCode < 400;
  },
});
// Request Logger Mode Custom 1:
/* this mode returns method, url, status and response time
it is custome made. */
const reqLoggerCustom1 = morgan(function (tokens, req, res) {
  return [
    tokens.method(req, res),
    tokens.url(req, res),
    tokens.status(req, res),
    tokens["response-time"](req, res),
    "ms",
  ].join(" ");
});
// Exports:
module.exports = { reqLoggerTiny, reqLoggerDev, reqLoggerDevErrOnly, reqLoggerCustom1 };
