import dotenv from 'dotenv';
dotenv.config({ path: './.env' });
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import connectDB from './config/db.js';
const port = process.env.PORT || 5000;

const app = express();
app.use(cors({
    origin: [
        "http://localhost:5173",
        "https://khorcha-kota-psi.vercel.app"
        
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());


connectDB();

app.get('/', (req, res) => {
    res.send('Hello World!');
})

import authRouter from './routers/auth.route.js';
import budgetRouter from './routers/budget.route.js';
import expenseRouter from './routers/expense.route.js';


app.use('/api/v1/auth', authRouter);
app.use('/api/v1', budgetRouter);
app.use('/api/v1', expenseRouter);


app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
  
