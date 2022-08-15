const mongoose = require("mongoose");
const Transaction = require("./transactionModel");

const groupSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please enter the group's name"],
      maxlength: [15, "Maximum group's name characters is 15"],
      minlength: [3, "Minimum group's name character is 3"],
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    members: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "User",
    },
    currency: {
      type: String,
      required: true
    },
    wallet: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

groupSchema.pre("save", async function () {
  let total = 0;
  const transactions = await Transaction.find({ group: this._id });
  transactions.forEach((transaction) => {
    total += transaction.amount;
  });
  this.wallet = total;
});

groupSchema.methods.add_member = function (id) {
  this.members.push(id);
  this.save();
};

module.exports = mongoose.model("Group", groupSchema);
