import { Budget } from "../models/budget.model.js";
import { Expense } from "../models/expense.model.js";
import asyncHandler from "../utils/AsyncHandler.js";

export const addExpense = asyncHandler(async (req, res) => {
  const { userId, expense } = req.body;

  if (!userId || !expense) {
    return res.status(400).json({ message: "Please provide all fields" });
  }

  if (!Array.isArray(expense)) {
    return res.status(400).json({ message: "Expense should be an array" });
  }

  // Validate that all items in the expense array have required fields
  const invalidItems = expense.filter(
    (item) => !item.kgprice || !item.qty || isNaN(item.kgprice) || isNaN(item.qty)
  );

  if (invalidItems.length > 0) {
    return res.status(400).json({
      message: "All expense items must have valid `kgprice` and `qty` fields",
      success: false,
    });
  }

  const month = new Date()
    .toLocaleString("default", { month: "long" })
    .toLowerCase();
  const year = new Date().getFullYear();

  try {
    const budget = await Budget.findOne({ userId });

    if (!budget) {
      return res.status(404).json({ message: "Check budget", success: false });
    }

    const expenseTotal = expense.reduce((total, item) => {
      const itemQty = item.qty;
      const itemKgPrice = item.kgprice;
      const totalAmount = itemQty * itemKgPrice;
      return total + totalAmount;
    }, 0);

    const isDue = budget?.remainingBudget < expenseTotal;
    if (isDue) {
      return res
        .status(201)
        .json({ message: "Budget issue! Please check your budget.", success: false });
    }

    const expenseData = await Expense.findOne({ userId, month, year });

    if (expenseData) {
      if (!isDue) {
        //  sort expenses by date
        expenseData.expense.push(...expense);
        expenseData.expense.sort((a, b) => new Date(b.date) - new Date(a.date));
        await expenseData.save();

        await Budget.findOneAndUpdate(
          { userId },
          {
            $inc: { remainingBudget: -expenseTotal },
          },
          { new: true }
        );

        return res
          .status(200)
          .json({ message: "Expense added successfully", success: true });
      }
    } else {
      // Sort the new expenses by date before saving
      const sortedExpenses = expense.sort((a, b) => new Date(a.date) - new Date(b.date));

      const newExpense = new Expense({
        userId,
        expense: sortedExpenses,
        month,
        year,
      });
      await newExpense.save();

      await Budget.findOneAndUpdate(
        { userId },
        {
          $inc: { remainingBudget: -expenseTotal },
        },
        { new: true }
      );

      return res
        .status(201)
        .json({ message: "Expense created successfully", success: true });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

export const getExpense = asyncHandler(async (req, res) => {
  const { userId, month, year,filterDate} = req.query;
  
  if (!userId) {
    return res.status(400).json({ message: "Please provide all fields" });
  }
  try {
    const expenseRecord = await Expense.findOne({ userId, month, year }).select("-year -month -createdAt -updatedAt");

    if (!expenseRecord) {
      return res.status(404).json({ message: "No expense data found" });
    }

    let filteredExpenses = expenseRecord.expense;

    // Filter only if filterDate is provided and not empty
    if (filterDate && filterDate.trim() !== "") {
      filteredExpenses = filteredExpenses.filter(item => item.date === filterDate);
    }

    return res.status(200).json({
      message: "Expense data retrieved successfully",
      expenses: filteredExpenses,
    })
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

export const updateExpense = asyncHandler(async (req, res) => {
  const { userId, expenseId, updatedExpense } = req.body;

  if (!userId || !expenseId || !updatedExpense) {
    return res.status(400).json({ message: "Please provide all fields" });
  }

  try {
    const expenseData = await Expense.findOne({ userId });
    if (!expenseData) {
      return res.status(404).json({ message: "No expense found for the user" });
    }

    const expenseIndex = expenseData.expense.findIndex(
      (exp) => exp._id.toString() === expenseId
    );

    if (expenseIndex === -1) {
      return res.status(404).json({ message: "Expense item not found" });
    }

    // Update the specific expense item
    expenseData.expense[expenseIndex] = {
      ...expenseData.expense[expenseIndex]._doc, // Preserve existing fields
      ...updatedExpense, // Overwrite with updated fields
    };

    // Save the updated expense data
    await expenseData.save();

    return res.status(200).json({
      message: "Expense updated successfully",
      updatedExpense: expenseData.expense[expenseIndex], success: true
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

export const deleteExpense = asyncHandler(async (req, res) => {
  const { userId, expenseId } = req.body;
 
  
  if (!userId || !expenseId) {
    return res.status(400).json({ message: "Please provide all fields" });
  }
  try {
    const expenseData = await Expense.findOne({ userId });
    if (!expenseData) {
      return res.status(404).json({ message: "No expense found for the user" });
    }

    const item = expenseData.expense.find(
      (exp) => exp._id.toString() === expenseId
    );
    if (!item) {
      return res.status(404).json({ message: "Expense item not found" });
    }

    const updatedExpenseData = await Expense.findOneAndUpdate(
      { userId },
      { $pull: { expense: { _id: expenseId } } },
      { new: true }
    );

    return res
      .status(200)
      .json({ message: "Expense deleted successfully", updatedExpenseData, success: true});
  } catch (error) {
   return res.status(500).json({ message: "Internal server error" });
  }
});
