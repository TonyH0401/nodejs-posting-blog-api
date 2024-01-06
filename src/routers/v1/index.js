const router = require("express").Router();
// Require Defined Routers:
const AccountsRouter = require("./AccountsRouter");
// Use Defined Routers:
// /api/v1/accounts/...
router.use("/accounts", AccountsRouter);
// Exports:
module.exports = router;
