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

  const mounth = new Date()
    .toLocaleString("default", { month: "long" })
    .toLocaleLowerCase();
  const year = new Date().getFullYear();
  try {
    const budget = await Budget.findOne({ userId });

    const expenseTotal = expense.reduce((total, item) => {
      return total + item.itemprice;
    }, 0);

    console.log(expenseTotal);

    const isDue = budget?.remainingBudget < expenseTotal;

    const expenseData = await Expense.findOne({ userId, mounth, year });
    if (expenseData) {
      expenseData.expense.push(...expense);
      await expenseData.save();
      if (!isDue) {
         await Budget.findOneAndUpdate(
          { userId },
          {
            $inc: { remainingBudget: -expenseTotal },
          },
          { new: true }
        );

        await budget.save();
      }
      return res.status(200).json({ message: "Expense added successfully" });
    } else {
      const newExpense = new Expense({
        userId,
        expense,
        mounth: new Date()
          .toLocaleString("default", { month: "long" })
          .toLocaleLowerCase(),
        year: new Date().getFullYear(),
      });
      await newExpense.save();

      if (!isDue) {
        await Budget.findOneAndUpdate(
          { userId },
          {
            $inc: { remainingBudget: -expenseTotal },
          },
          { new: true }
        );

        await budget.save();
      }

      return res
        .status(201)
        .json({ message: "Expense created successfully", budget });
    }
  } catch (error) {
    console.log(error);
    
    res.status(500).json({ message: "Internal server error" });
  }
});

export const getExpense = asyncHandler(async (req, res) => {
  const { userId } = req.body;
  if (!userId) {
    return res.status(400).json({ message: "Please provide all fields" });
  }
  try {
    const expenseData = await Expense.findOne({ userId });
    if (!expenseData) {
      return res.status(404).json({ message: "No expense found" });
    }
    return res
      .status(200)
      .json({ message: "Expense fetched successfully", expenseData });
  } catch (error) {
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
      .json({ message: "Expense deleted successfully", updatedExpenseData });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});
