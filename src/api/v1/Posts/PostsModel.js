const Schema = require("mongoose").Schema;
const slugify = require("slugify");
const createError = require("http-errors");
// Import Database Connection:
const { mongodbConn } = require("../../../database/mongoose");
// Define PostsModel:
const PostsSchema = new Schema(
  {
    postTitle: { type: String, required: [true, "{PATH} is required"] },
    postContent: { type: String, required: [true, "{PATH} is required"] },
    postAuthor: {
      type: Schema.Types.ObjectId,
      ref: "AccountsModel",
      required: [true, "{PATH} is required"],
    },
    postSlug: { type: String, default: "" },
    postBanner: {
      cloudinaryPubId: { type: String, default: "" },
      cloudinaryLink: { type: String, default: "" },
    },
    // remember to delete this section
    idEx: { type: Number, unique: true },
  },
  { timestamps: true }
);
// Triggers:
/* Mongoose Middleware works at Schema level not Model level */
PostsSchema.post("save", async function (doc, next) {
  // I am testing error handling using .post hook
  // because the doc is run after saving, you need to have doc and next\
  // doc is used for the doc, next is used for next hook
  try {
    if (doc.idEx == 2) {
      throw new Error("Yolo?");
    }
    console.log("inside hook");
    return next();
  } catch (err) {
    console.log("inside catch method");
    return next(createError(500, err.message));
  }
  // if (err) {
  //   console.log("inside save");
  //   return next(createError(500, err.message));
  // }
  // console.log("does it goes? 1");
  // try {
  //   // if (doc.idEx == 2) {
  //   //   throw new Error("WTF???????");
  //   // }
  //   console.log("does it goes?");
  //   doc.postSlug = slugify(doc.postTitle, { lower: true });
  //   doc.save();
  //   return next();
  // } catch (error) {
  //   console.log("inside save trycatch");
  //   return next(createError(500, error.message));
  // }
});
// Exports:
module.exports = mongodbConn.model("PostsModel", PostsSchema);
