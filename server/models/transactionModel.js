const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please add the transaction's name"],
    },
    amount: {
      type: Number,
      required: [true, "Please set the transaction's amount"],
    },
    group: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Group",
    },
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Transaction", transactionSchema);
