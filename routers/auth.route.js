import express from 'express';
import { getLoginUser, login, logout, register } from '../controllers/auth.controller.js';
import verifyUser from '../middleware/verfyUser.middleware.js';


const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', verifyUser, logout);
router.get('/login-user', verifyUser, getLoginUser)

export default router;