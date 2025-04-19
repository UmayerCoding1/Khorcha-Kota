import express from 'express';
import verifyUser from '../middleware/verfyUser.middleware.js';
import { addExpense, deleteExpense, getExpense } from '../controllers/expense.controller.js';

const router = express.Router();

router.post('/add-expense',verifyUser, addExpense);
router.get('/get-expense',verifyUser, getExpense);
router.delete('/delete-expense',verifyUser, deleteExpense);

export default router;