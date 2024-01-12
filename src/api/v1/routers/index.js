const router = require("express").Router();
// Custom Middlewares, Utils:
const {
  limiter100Req15Min,
  limiter10Req1Min,
} = require("../../../utils/requestLimiter");
// Import Routers:
const AccountsRouter = require("./AccountsRouter");
// Use Routers:
// /api/v1/accounts/...
router.use("/accounts", limiter10Req1Min, AccountsRouter);
// Exports:
module.exports = router;
