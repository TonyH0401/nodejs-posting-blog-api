const { default: mongoose } = require("mongoose");

const Schema = require("mongoose").Schema;
// Define AccountsModel
const AccountsModel = new Schema(
  {
    // User Input Data:
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    // birthDay: { type: Date, required: true },
    emailAddress: { type: String, required: true },
    accountPassword: { type: String, required: true },
    // Automatically Created Data:
    userId: { type: String, required: true },
    isValidated: { type: Boolean, default: false },
  },
  { timestamps: true }
);
// Exports:
module.exports = mongoose.model("AccountsModel", AccountsModel);
