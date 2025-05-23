import express from 'express';
import dotenv from 'dotenv';
import authRouter from './route/auth.routes.js';
import householdRouter from './route/household.routes.js';
import citizenRouter from './route/citizen.routes.js';


dotenv.config(); // load biến môi trường từ .env

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// Mount router đúng cách với app.use
app.use('/api/auth', authRouter);
app.use('/api/households', householdRouter);
app.use('/api/citizens', citizenRouter);



app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
