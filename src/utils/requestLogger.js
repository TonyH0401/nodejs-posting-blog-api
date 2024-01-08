const morgan = require("morgan");
// Request Logger Tiny
const reqLogTiny = morgan("tiny");
// Request Logger Developer
const reqLogDev = morgan("dev");
// Request Logger Developer Error Only
const reqLogDevErrOnly = morgan("dev", {
  skip: function (req, res) {
    return res.statusCode < 400;
  },
});
// Request Logger Custom with method, url, status and response time
const reqLogCustom1 = morgan(function (tokens, req, res) {
  return [
    tokens.method(req, res),
    tokens.url(req, res),
    tokens.status(req, res),
    tokens["response-time"](req, res),
    "ms",
  ].join(" ");
});
// Exports:
module.exports = { reqLogTiny, reqLogDev, reqLogDevErrOnly, reqLogCustom1 };
