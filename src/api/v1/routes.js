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
// Posts Router: /api/v1/posts/...
const PostsRouter = require("./Posts/PostsRouter");
router.use("/posts", limit100Req15Min, PostsRouter);
// Comment Router: /api/v1/comment/...
const CommentsRouter = require("./Comments/CommentsRouter");
router.use("/comments", limit100Req15Min, CommentsRouter);
// CommentV2 Router: /api/v1/comment2/...
const CommentsV2Router = require("./CommentsV2/CommentsV2Router");
router.use("/commentsV2", limit100Req15Min, CommentsV2Router);
// Exports:
module.exports = router;
