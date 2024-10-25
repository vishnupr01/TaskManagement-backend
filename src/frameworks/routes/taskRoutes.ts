import express, { NextFunction, Request, Response } from 'express'
import { TaskRepository } from '../../repository/taskRepository'
import { TaskUsecase } from '../../useCase/task.useCase'
import { TaskController } from '../../controllers/task.controller'
import { authMiddleware } from '../middlewares/authMiddleware'
import { UserRepository } from '../../repository/user.repository'
const taskRepository = new TaskRepository()
const userRepository=new UserRepository()
const taskUsecase = new TaskUsecase(taskRepository,userRepository)
const taskController = new TaskController(taskUsecase)

const router = express.Router()
router.get('/assignedEmployess', authMiddleware, (req: Request, res: Response, next: NextFunction) => {
  taskController.getAssignedEmployess(req, res, next)
})
router.post('/createTask', authMiddleware, (req: Request, res: Response, next: NextFunction) => {
  taskController.createTask(req, res, next)
})
router.get('/tasksByManager', authMiddleware, (req: Request, res: Response, next: NextFunction) => {
  taskController.getTasksByManager(req, res, next);
});
router.delete('/deleteTasks/:taskId', authMiddleware, (req: Request, res: Response, next: NextFunction) => {
  taskController.deleteTask(req, res, next);
});

export default router