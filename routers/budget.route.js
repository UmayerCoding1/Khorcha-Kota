import express from 'express';
import { addBudget, addNextBudget, getBudget } from '../controllers/bodget.controller.js';
import verifyUser from '../middleware/verfyUser.middleware.js';

const router = express.Router();

router.post('/add-budget',verifyUser ,addBudget);
router.get('/get-budget',verifyUser ,getBudget);
router.put('/next-budget',verifyUser,addNextBudget);

export default router;