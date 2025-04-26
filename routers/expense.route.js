import express from 'express';
import verifyUser from '../middleware/verfyUser.middleware.js';
import { addExpense, deleteExpense, getExpense, updateExpense } from '../controllers/expense.controller.js';

const router = express.Router();

router.post('/add-expense',verifyUser, addExpense);
router.get('/get-expense',verifyUser, getExpense);
router.patch('/update-expense',verifyUser, updateExpense)
router.delete('/delete-expense',verifyUser, deleteExpense);

export default router;