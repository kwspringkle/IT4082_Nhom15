import express from 'express';
import dotenv, { config } from 'dotenv';
import authRouter from './route/auth.routes.js';
import householdRouter from './route/household.routes.js';
import citizenRouter from './route/citizen.routes.js';
import searchRouter from './route/search.routes.js';
import historyRouter from './route/history.routes.js';
import feeRouter from './route/fee.routes.js';
import paymentRouter from './route/payment.routes.js';
import statisticsRouter from './route/statistics.routes.js';
import accountRouter from './route/account.routes.js';
import cors from 'cors';
import { connectDB } from './config/db.js';
import cookieParser from 'cookie-parser';


dotenv.config(); // load biến môi trường từ .env

const app = express();
const port = process.env.PORT || 3000;

app.use(cors({
  origin: 'http://localhost:8080',  // frontend URL
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,  // <=== Thêm dòng này để cho phép gửi cookie
}));

// Thêm middleware cookie parser trước khi dùng authenticate
app.use(cookieParser());

app.use(express.json());

connectDB();


// Mount router đúng cách với app.use
app.use('/api/auth', authRouter);
app.use('/api/households', householdRouter); //
app.use('/api/citizens', citizenRouter);
app.use('/api/search', searchRouter);
app.use('/api/history', historyRouter); 
app.use('/api/fees', feeRouter);// Lấy hết tất cả thông tin
app.use('/api/payments', paymentRouter);
app.use('/api/statistics', statisticsRouter); //
app.use('/api/accounts', accountRouter);


app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
