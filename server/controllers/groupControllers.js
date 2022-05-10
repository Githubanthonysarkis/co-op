const asyncHandler = require("express-async-handler");
const Group = require("../models/groupModel");
const Transaction = require("../models/transactionModel");
const User = require("../models/userModel");

const handleGroupError = (err) => {
  let error;
  if (err.message.includes("Group validation failed")) {
    Object.values(err.errors).forEach(({ properties }) => {
      error = properties.message;
    });
  }

  return error;
};

const handleTransactionError = (err) => {
  const errors = {
    name: "",
    amount: "",
  };

  if (err.message.includes("Transaction validation failed")) {
    Object.values(err.errors).forEach(({ properties }) => {
      errors[properties.path] = properties.message;
    });
  }

  return errors;
};

// Get groups

const getGroups = asyncHandler(async (req, res) => {
  const all_groups = await Group.find();
  const groups = all_groups.filter((group) =>
    group.members.includes(req.user._id)
  );
  if (groups) {
    res.status(200).json(groups);
  } else {
    throw new Error("Unexpected error occured");
  }
});

// Create groups

const createGroup = async (req, res) => {
  try {
    const { name } = req.body;

    const group = await Group.create({
      name,
      createdBy: req.user._id,
      members: [req.user._id],
    });

    if (group) {
      res.status(201).json(group);
    } else {
      console.log("hey?");
      res.status(400);
      throw new Error("An unexpected error occured");
    }
  } catch (err) {
    const error = handleGroupError(err);
    res.status(400).json({
      message: error,
      stack: process.env.NODE_ENV === "production" ? null : err.stack,
    });
  }
};

// Get one group
const getOneGroup = asyncHandler(async (req, res) => {
  let group = await Group.findById(req.params.id);

  if (!group.members.includes(req.user._id)) {
    res.status(403);
    throw new Error("User unauthorized");
  }

  group = {
    ...group._doc,
    admin: (await User.findById(group.createdBy)).username,
  };

  const members = [];

  for (let i = 0; i < group.members.length; i++) {
    const user = await User.findById(group.members[i]);
    members.push(user.username);
  }

  group.members = members;
  group.createdBy = (await User.findById(group.createdBy)).username;

  res.status(200).json(group);
});

// Add member
const addMember = asyncHandler(async (req, res) => {
  const group = await Group.findById(req.params.id);

  if (group.createdBy.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error("User unauthorized, only admin can add members");
  }
  if (!req.body.username) {
    res.status(400);
    throw new Error("Please select who you want to add");
  }

  const addedUser = await User.findOne({ username: req.body.username });

  if (addedUser) {
    group.add_member(addedUser._id);
    res.status(200).json({ username: addedUser.username });
  } else {
    res.status(400);
    throw new Error(`${req.body.username} was not found`);
  }
});

// Get all transactions

const getTransactions = asyncHandler(async (req, res) => {
  const group = await Group.findById(req.params.id);

  if (!group.members.includes(req.user._id)) {
    res.status(403);
    throw new Error("User unauthorized");
  }

  const transactions = await Transaction.find({ group: group._id });
  res.status(200).json(transactions);
});

const createTransaction = async (req, res) => {
  const { name, amount } = req.body;
  try {
    const transaction = await Transaction.create({
      name,
      amount,
      group: req.params.id,
      postedBy: req.user._id,
    });

    (await Group.findById(req.params.id)).save();

    if (transaction) {
      res.status(200).json(transaction);
    }
  } catch (err) {
    const errors = handleTransactionError(err);

    // Object.values(errors).forEach(error => {
    //     if(error.length > 0) {
    //         return res.status(401).json({
    //             message: error,
    //             stack: process.env.NODE_ENV === 'production' ? null : err.stack
    //         })
    //     };
    // })

    for (let error of Object.values(errors)) {
      if (error.length > 0) {
        return res.status(400).json({
          message: error,
          stack: process.env.NODE_ENV === "prodcution" ? null : err.stack,
        });
      }
    }
  }
};

const deleteTransaction = asyncHandler(async (req, res) => {
  const transactionId = req.params.transactionId;

  await Transaction.findByIdAndDelete(transactionId);

  (await Group.findById(req.params.id)).save();

  res.status(200).json({ id: transactionId });
});

const deleteGroup = asyncHandler(async (req, res) => {
  const group = await Group.findById(req.params.id);

  if (req.user._id.toString() !== group.createdBy.toString()) {
    throw new Error("Only the admin of the group can delete the group");
  }

  const transactions = await Transaction.find({ group: group._id });

  transactions.forEach(async (transaction) => {
    await transaction.remove();
  });

  await group.remove();

  res.status(200).json({ id: req.params.id });
});

module.exports = {
  getGroups,
  createGroup,
  getOneGroup,
  addMember,
  getTransactions,
  createTransaction,
  deleteTransaction,
  deleteGroup,
};
