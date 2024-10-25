import express, { NextFunction, Request, Response } from 'express'
import { UserRepository } from '../../repository/user.repository'
import { UserUsecase } from '../../useCase/user.useCase'
import { UserController } from '../../controllers/user.controller'
import { DepartmentRepository } from '../../repository/department.repository'
import { authMiddleware } from '../middlewares/authMiddleware'
const router = express.Router()
const userRepository = new UserRepository()
const departmentRepository = new DepartmentRepository()
const userUsecase = new UserUsecase(userRepository, departmentRepository)
const userController = new UserController(userUsecase)

router.post('/register', (req: Request, res: Response, next: NextFunction) => {
  userController.register(req, res, next)
})
router.post('/verifyOtp', (req: Request, res: Response, next: NextFunction) => {
  userController.verifyOtp(req, res, next)
})
router.post('/reSendOtp', (req: Request, res: Response, next: NextFunction) => {
  userController.resendOtp(req, res, next)
})
router.post('/login', (req: Request, res: Response, next: NextFunction) => {
  userController.login(req, res, next)
})
router.get('/getDepartments', (req: Request, res: Response, next: NextFunction) => {
  userController.getDepartmentNames(req, res, next)
})
router.post('/resendOtp', (req: Request, res: Response, next: NextFunction) => {
  userController.reSendOtp(req, res, next)
})
router.get('/verifyToken', authMiddleware, (req: Request, res: Response, next: NextFunction) => {
  console.log("entering...");
  userController.isUser(req, res, next)
})
export default router