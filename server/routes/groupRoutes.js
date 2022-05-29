const router = require("express").Router();
const {
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
} = require("../controllers/groupControllers");

router.route("/").get(getGroups).post(createGroup);

router.route("/:id").get(getOneGroup).post(addMember).delete(deleteGroup);

router.route("/:id/transactions").get(getTransactions).post(createTransaction);

router.route("/:id/transactions/:transactionId").delete(deleteTransaction);

router.route("/:id/members").post(kickMember);

router.route("/:id/leave").get(leaveGroup);

module.exports = router;
