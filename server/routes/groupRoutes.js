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
} = require("../controllers/groupControllers");

router.route("/").get(getGroups).post(createGroup);

router.route("/:id").get(getOneGroup).post(addMember).delete(deleteGroup);

router.route("/:id/transactions").get(getTransactions).post(createTransaction);

router.delete("/:id/transactions/:transactionId", deleteTransaction);

module.exports = router;
