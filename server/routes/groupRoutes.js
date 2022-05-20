const router = require("express").Router();
const {
  getGroups,
  createGroup,
  getOneGroup,
  addMember,
  getTransactions,
  getTransaction,
  createTransaction,
  deleteTransaction,
  deleteGroup,
} = require("../controllers/groupControllers");

router.route("/").get(getGroups).post(createGroup);

router.route("/:id").get(getOneGroup).post(addMember).delete(deleteGroup);

router.route("/:id/transactions").get(getTransactions).post(createTransaction);

router
  .route("/:id/transactions/:transactionId")
  .get(getTransaction)
  .delete(deleteTransaction);

module.exports = router;
