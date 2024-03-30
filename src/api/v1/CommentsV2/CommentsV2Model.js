const Schema = require("mongoose").Schema;
const createError = require("http-errors");
// Import Database Connection:
const { mongodbConn } = require("../../../database/mongoose");
// Define CommentsSchema:
const CommentsV2Schema = new Schema(
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
      ref: "CommentsV2Model",
      default: null,
    },
    children: [
      {
        type: Schema.Types.ObjectId,
        ref: "CommentsV2Model",
      },
    ],
    accountRecipient: {
      type: Schema.Types.ObjectId,
      ref: "AccountsModel",
      default: null,
    },
  },
  { timestamps: true }
);
// Pre Hook to Save Children to Parent:
CommentsV2Schema.pre("save", async function (next) {
  const CommentsV2Model = require("./CommentsV2Model");
  try {
    if (this.parent) {
      console.log("inside pre hook for saving a new comment");
      const parentExist = await CommentsV2Model.findById(this.parent);
      if (!parentExist) {
        return next(
          createError(404, `Parent Comment ID: ${this.parent} Not Found`)
        );
      }
      await CommentsV2Model.findByIdAndUpdate(
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
module.exports = mongodbConn.model("CommentsV2Model", CommentsV2Schema);
