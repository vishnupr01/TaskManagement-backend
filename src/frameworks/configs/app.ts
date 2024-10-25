import express, { NextFunction, Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import userRoutes from '../routes/userRoutes';
import taskRoutes from '../routes/taskRoutes';

dotenv.config();

const app = express();
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true }));

// Ensure no trailing slash in the allowed origins
const allowOrigins = ['https://task-manage-ment-front-end.vercel.app'];

app.use(
  cors({
    origin: allowOrigins,
    optionsSuccessStatus: 200,
    credentials: true,
  })
);

app.use(cookieParser());
app.use('/api/user', userRoutes);
app.use('/api/task', taskRoutes);

// Catch-all route for 404 errors
app.all('*', (req: Request, res: Response, next: NextFunction) => {
  res.status(404).json({ message: 'Route not found' });
});

export default app;
