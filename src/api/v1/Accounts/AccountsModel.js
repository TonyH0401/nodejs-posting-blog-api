const Schema = require("mongoose").Schema;
// Import Database Connection:
const { mongodbConn } = require("../../../database/mongoose");
// Define AccountsModel:
const AccountsModel = mongodbConn.model(
  "AccountsModel",
  new Schema(
    {
      accountName: { type: String, required: true },
      accountPassword: { type: String, required: true },
      accountEmail: { type: String, required: true },
      isValidated: { type: Boolean, default: false },
    },
    { timestamps: true }
  )
);
// Exports:
module.exports = AccountsModel;
