const router = require("express").Router();
// Custom Utils:
// Custom Middlewares:
// Connect to database: --17/3/2017
const { dbConnection } = require("../../database/mongoose");
// await dbConnection()
// Acounts Router: /api/v1/accounts/...
const AccountsRouter = require("./Accounts/AccountsRouter");
router.use("/accounts", AccountsRouter);
// Exports:
module.exports = router;
