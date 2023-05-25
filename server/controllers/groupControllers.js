const asyncHandler = require("express-async-handler");
const Group = require("../models/groupModel");
const Transaction = require("../models/transactionModel");
const User = require("../models/userModel");

const handleGroupError = (err) => {
  // For formatting
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
  // Get the user id
  const user = await User.findById(req.user._id);
  if (!user) {
    throw new Error("Authorization error");
  }

  // Get groups in which the user is a participant
  let groups = [];
  for (let i = 0; i < user.groups.length; i++) {
    const group = await Group.findById(user.groups[i]);
    groups.push(group);
  }
  if (groups) {
    res.status(200).json(groups);
  } else {
    throw new Error("Unexpected error occured");
  }
});

// Create groups
const createGroup = async (req, res) => {
  try {
    // Get group settings from the request body and create a new group with these settings
    const { name, currency } = req.body;

    // Get the user id from the request to make the current user an admin
    const user = await User.findById(req.user._id);

    const group = await Group.create({
      name,
      currency: currency || "LBP",
      createdBy: req.user._id,
      members: [req.user._id],
    });

    if (group) {
      user.groups.push(group._id);
      await user.save();
      res.status(201).json(group);
    } else {
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
  // Find group in database according to the request
  let group = await Group.findById(req.params.id);

  if (!group) {
    res.status(404);
    throw new Error("That group does not exist");
  }

  // If the current user is not a participant in the group throw error
  if (!group.members.includes(req.user._id)) {
    res.status(403);
    throw new Error("User unauthorized");
  }

  // Mutate the response as to send the users' usernames rather than their id
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
  // Get the group by its id
  const group = await Group.findById(req.params.id);

  // If user is not admin throw error
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
    if (group.members.includes(addedUser._id)) {
      res.status(400);
      throw new Error(`${req.body.username} is already in the group!`);
    } else {
      // Add the user to the group
      group.add_member(addedUser._id);
      addedUser.groups.push(group._id);
      await addedUser.save();
      res.status(200).json({ username: addedUser.username });
    }
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

  // Given the group's id, get all the transactions

  let transactions = await Transaction.find({ group: group._id }).sort({
    createdAt: -1,
  });

  // Mutate the response to include the user's username rather than his id
  for (let i = 0; i < transactions.length; i++) {
    transactions[i] = {
      ...transactions[i]._doc,
      postedBy: (await User.findById(transactions[i].postedBy)).username,
    };
  }
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

    // To recalculate group's wallet
    (await Group.findById(req.params.id)).save();

    if (transaction) {
      res.status(200).json({
        ...transaction._doc,
        postedBy: req.user.username,
      });
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

  // To recalculate group's wallet
  (await Group.findById(req.params.id)).save();

  res.status(200).json({ id: transactionId });
});

const deleteGroup = asyncHandler(async (req, res) => {
  const group = await Group.findById(req.params.id);
  const { _id: id } = group;

  if (req.user._id.toString() !== group.createdBy.toString()) {
    res.status(401);
    throw new Error("Only the admin of the group can delete the group");
  }

  for (let i = 0; i < group.members.length; i++) {
    let user = await User.findById(group.members[i]);
    for (let j = 0; j < user.groups.length; j++) {
      if (user.groups[j].toString() === id.toString()) {
        // Remove the group from the individual group's array of every member
        user.groups.splice(j, 1);
      }
    }
    await user.save();
    /*
     * await action before proceeding, or else group is removed from db before the group array,
     * causing a fatal frontend crash
     */
  }

  await group.remove();

  // Remove all transactions from the deleted group
  const transactions = await Transaction.find({ group: id });

  transactions.forEach(async (transaction) => {
    await transaction.remove();
  });

  res.status(200).json({ id: req.params.id });
});

const kickMember = asyncHandler(async (req, res) => {
  const group = await Group.findById(req.params.id);

  if (req.user._id.toString() !== group.createdBy.toString()) {
    res.status(401);
    throw new Error("Only the admin of the group can kick members");
  }

  const user = await User.findOne({ username: req.body.username });

  if (group.members.includes(user._id)) {
    for (let i = 0; i < group.members.length; i++) {
      if (group.members[i].toString() === user._id.toString()) {
        group.members.splice(i, 1);
        // Remove the user from the group's member array...
        group.save();
      }
    }

    for (let i = 0; i < user.groups.length; i++) {
      if (user.groups[i].toString() === group._id.toString()) {
        // ... and remove the group from the user's groups array
        user.groups.splice(i, 1);
      }
    }
    await user.save();

    res.status(200).json({ username: user.username });
  } else {
    res.status(400);
    throw new Error("The member you are trying to kick isn't in the group");
  }
});

const leaveGroup = asyncHandler(async (req, res) => {
  const group = await Group.findById(req.params.id);
  const user = await User.findById(req.user._id);

  if (!user) {
    throw new Error("Authorization error");
  }

  if (group.members.includes(req.user._id)) {
    if (group.createdBy.toString() === req.user._id.toString()) {
      res.status(400);
      // For now, admins cannot leave the group.
      // TODO: When admin leaves make the oldest member of the group the admin
      throw new Error("Admins cannot leave their group");
    }
    group.members = group.members.filter(
      (member) => member.toString() !== req.user._id.toString()
    );
    for (let i = 0; i < user.groups.length; i++) {
      if (user.groups[i].toString() === group._id.toString()) {
        user.groups.splice(i, 1);
      }
    }
    await user.save();
    group.save();
    res.status(200).json({
      username: req.user.username,
    });
  } else {
    res.status(403);
    throw new Error("You do not belong to this group");
  }
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
  kickMember,
  leaveGroup,
};
