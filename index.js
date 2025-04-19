import dotenv from 'dotenv';
dotenv.config({ path: './.env' });
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import connectDB from './config/db.js';
const port = process.env.PORT || 5000;

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());


connectDB();

app.get('/', (req, res) => {
    res.send('Hello World!');
})

import authRouter from './routers/auth.route.js';
app.use('/api/v1/auth', authRouter);

app.listen(port, ( )=> {
    console.log(`Server is running on port ${port}`);
})
