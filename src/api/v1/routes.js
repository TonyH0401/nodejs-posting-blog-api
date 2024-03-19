const router = require("express").Router();
// Custom Utils:
// Custom Middlewares:
// Connect to Database:
/* MongoDB Database */
/* using createConnection, you don't have to call mongodbConn 
in the versioning index like this "routes". the moment you use the function
for example in the definition of a schema, you have already called it. */
const { mongodbConn } = require("../../database/mongoose");
// Acounts Router: /api/v1/accounts/...
const AccountsRouter = require("./Accounts/AccountsRouter");
router.use("/accounts", AccountsRouter);
// Exports:
module.exports = router;
