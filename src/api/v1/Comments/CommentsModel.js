const Schema = require("mongoose").Schema;
const createError = require("http-errors");
// Import Database Connection:
const { mongodbConn } = require("../../../database/mongoose");
// Define CommentsSchema:
const CommentsSchema = new Schema(
  {
    commentPost: {
      type: Schema.Types.ObjectId,
      ref: "PostsModel",
      required: [true, "{PATH} is required"],
    },
    commentAuthor: {
      type: Schema.Types.ObjectId,
      ref: "AccountsModel",
      required: [true, "{PATH} is required"],
    },
    commentContent: { type: String, required: [true, "{PATH} is required"] },
    parent: {
      type: Schema.Types.ObjectId,
      ref: "CommentsModel",
    },
    children: [
      {
        type: Schema.Types.ObjectId,
        ref: "CommentsModel",
      },
    ],
  },
  { timestamps: true }
);
// Pre Hook to Save Children to Parent:
CommentsSchema.pre("save", async function (next) {
  /* 
    we put the model in here because we want to mitigate the circular requirement problem.
    if we put the model outside, the model hasn't been created but it's already been required.
    pre hook only execute when it's being called, so the pre hook will execute after
    the model has been created.
  */
  const CommentsModel = require("./CommentsModel");
  try {
    if (this.parent) {
      console.log(1);
      const parentExist = await CommentsModel.findById(this.parent);
      if (!parentExist) {
        return next(
          createError(404, `Parent Comment Id: ${this.parent} Not Found`)
        );
      }
      await CommentsModel.findByIdAndUpdate(
        this.parent,
        { $addToSet: { children: this._id } },
        { new: true }
      );
    }
    return next();
  } catch (error) {
    return next(createError(500, error.message));
  }
});
// Exports:
module.exports = mongodbConn.model("CommentsModel", CommentsSchema);
