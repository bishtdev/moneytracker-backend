const Transaction = require("../models/Transaction")

// get all transcitons
const getTransactions = async (req, res) => {
    try {
      // Fetch only the transactions for the logged-in user
      const transactions = await Transaction.find({ user: req.user._id }).sort({
        createdAt: -1,
      });
      res.status(200).json(transactions);
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ error: error.message });
    }
  };
  
// add new transcations
const addTransactions = async (req, res) => {
    try {
      // Add the user ID to the transaction
      const transaction = new Transaction({
        ...req.body,
        user: req.user._id, // Attach the logged-in user's ID
      });
  
      // Save the transaction to the database
      const savedTransaction = await transaction.save();
      res.status(201).json(savedTransaction);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

// delete new transctions

const deleteTransactions = async (req, res) => {
  try {
    const { id } = req.params;

    // Find the transaction
    const transaction = await Transaction.findById(id);

    // Logging for debugging
    console.log("Transaction found:", transaction);
    console.log("Authenticated user:", req.user);

    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    // Check if the logged-in user owns the transaction
    if (transaction.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to delete this transaction" });
    }

    // Delete the transaction using the model's static method
    await Transaction.findByIdAndDelete(id);
    res.status(200).json({ message: "Transaction deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

  

module.exports = {getTransactions, addTransactions, deleteTransactions}