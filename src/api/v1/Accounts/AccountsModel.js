const Schema = require("mongoose").Schema;
// Import Database Connection:
const { mongodbConn } = require("../../../database/mongoose");
// Define AccountsModel:
const AccountsModel = mongodbConn.model(
  "AccountsModel",
  new Schema(
    {
      accountFullName: { type: String, required: [true, "{PATH} is required"] },
      accountUserName: {
        type: String,
        required: [true, "{PATH} is required"],
        unique: true,
      },
      accountPassword: { type: String, required: [true, "{PATH} is required"] },
      accountEmail: {
        type: String,
        required: [true, "{PATH} is required"],
        unique: true,
      },
      accountGender: {
        type: String,
        enum: {
          values: ["male", "female", "other"],
          message: "{VALUE} is not supported",
        },
        default: "other",
      },
      accountBirthDay: { type: Date, required: [true, "{PATH} is required"] },
      isValidated: { type: Boolean, default: false },
      accountAvatar: {
        cloudinaryPubId: { type: String, default: "" },
        cloudinaryLink: { type: String, default: "" },
      },
    },
    { timestamps: true }
  )
);
// Exports:
module.exports = AccountsModel;
