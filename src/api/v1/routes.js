const router = require("express").Router();
// Custom Utils:
const { limit100Req15Min } = require("../../utils/requestLimiter");
// Custom Middlewares:
// Connect to Database:
// connect to mongodb database
/* using createConnection, you don't have to call mongodbConn 
in the versioning index like this "routes". the moment you use the function
for example in the definition of a schema, you have already called it. */
const { mongodbConn } = require("../../database/mongoose");
// Acounts Router: /api/v1/accounts/...
const AccountsRouter = require("./Accounts/AccountsRouter");
router.use("/accounts", limit100Req15Min, AccountsRouter);
// Exports:
module.exports = router;
