const Schema = require("mongoose").Schema;
const slugify = require("slugify");
const createError = require("http-errors");
// Import Database Connection:
const { mongodbConn } = require("../../../database/mongoose");
// Define PostsSchema:
const PostsSchema = new Schema(
  {
    postTitle: { type: String, required: [true, "{PATH} is required"] },
    postContent: { type: String, required: [true, "{PATH} is required"] },
    postAuthor: {
      type: Schema.Types.ObjectId,
      ref: "AccountsModel",
      required: [true, "{PATH} is required"],
    },
    postSlug: { type: String, unique: true, default: "" },
    postBanner: {
      cloudinaryPubId: { type: String, default: "" },
      cloudinaryLink: { type: String, default: "" },
    },
  },
  { timestamps: true }
);
/* Mongoose's Middleware/Hooks works at Schema level not Model level */
// Posts Triggers/Middleware/Hooks Section:
// 
PostsSchema.pre("save", async function (next) {
  try {
    console.log(1);
    if (this.isNew || this.isModified("postTitle")) {
      console.log(2);
      this.postSlug = slugify(this.postTitle, { lower: true });
      return next();
    }
  } catch (error) {
    return next(createError(500, error.message));
  }
});
// Exports:
module.exports = mongodbConn.model("PostsModel", PostsSchema);
