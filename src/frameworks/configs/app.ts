import express, { NextFunction, Request, Response } from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import userRoutes from '../routes/userRoutes'
import taskRoutes from '../routes/taskRoutes'


const app = express()
dotenv.config()
app.use(express.json({ limit: '50mb' }))
app.use(express.urlencoded({ extended: true }))
const allowOrigins = ['https://task-manage-ment-front-end.vercel.app']

app.use(cors({
  origin: allowOrigins,
  optionsSuccessStatus: 200,
  credentials: true
}))
app.use(cookieParser())
app.use('/api/user', userRoutes)
app.use('/api/task', taskRoutes)
app.all("*", (req: Request, res: Response, next: NextFunction) => {
  const error = new Error('error not found') as any
  error.statusCode = 401
  next(error)
})
export default app

