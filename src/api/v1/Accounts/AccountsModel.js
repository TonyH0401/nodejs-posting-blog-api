const { default: mongoose } = require("mongoose");
const Schema = require("mongoose").Schema;
// Import Database Connection:
const { dbConnection } = require("../../../database/mongoose");
// Define AccountsModel:
const AccountsModel = dbConnection.model(
  "AccountsModel",
  new Schema(
    {
      accountName: { type: String, required: true, default: "" },
      accountPassword: { type: String, required: true, default: "123" },
      accountEmail: { type: String, required: true, default: "" },
      isValidated: { type: Boolean, default: false },
    },
    { timestamps: true }
  )
);
// Exports:
module.exports = AccountsModel;
