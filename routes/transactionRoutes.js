const express = require("express");
const router = express.Router();

const {
  getTransactions,
  addTransactions,
  deleteTransactions,
} = require("../controllers/transactionController");
const { protect } = require("../middleware/authMiddleware");

// Apply `protect` middleware to all routes that require authentication
router
  .route("/")
  .get(protect, getTransactions) // Protect the get route
  .post(protect, addTransactions); // Protect the post route

router
  .route("/:id")
  .delete(protect, deleteTransactions); // Protect the delete route

module.exports = router;
