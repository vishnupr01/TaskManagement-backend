import { NextFunction, Request, Response } from "express";
import ITaskUseCase from "../interfaces/useCase/ITask.useCase";
import { AuthenticatedRequest } from "../frameworks/middlewares/authMiddleware";
import { ITask } from "../entities/task.entity";

export class TaskController {
  private taskUsecase: ITaskUseCase
  constructor(taskUsecase: ITaskUseCase) {
    this.taskUsecase = taskUsecase
  }
  async getAssignedEmployess(req: Request, res: Response, next: NextFunction) {
    try {
      const managerId = req.query.managerId
      const response = await this.taskUsecase.getEmployees(managerId as string)
      res.status(200).json({ status: "success", data: response })
    } catch (error: any) {
      res.status(400).json({ message: error.message })
    }
  }
  async createTask(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {

      const { taskData } = req.body;
      console.log(taskData);

      // Call the use case to create the task
      const newTask = await this.taskUsecase.createTask(taskData);
      console.log("got", newTask);

      res.status(201).json({ status: "success", data: newTask });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }
  async getTasksByManager(req: Request, res: Response, next: NextFunction) {
    try {
      const managerId = req.query.managerId as string;
      if (!managerId) {
        return res.status(400).json({ message: "Manager ID is required" });
      }

      const tasks = await this.taskUsecase.getTasksByManager(managerId);
      res.status(200).json({ status: "success", data: tasks });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }
  async deleteTask(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const taskId = req.params.taskId; // Get taskId from URL parameters
      const response = await this.taskUsecase.deleteTask(taskId); // Call the use case to delete the task
      res.status(200).json({ status: "success", data: response }); //
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }
  async getAssignedEmployees(req: Request, res: Response, next: NextFunction) {
    try {
      const taskId = req.query.taskId as string;
      if (!taskId) {
        return res.status(400).json({ message: "Manager ID is required" });
      }

      // Fetch assigned users through usecase
      const assignedUsers = await this.taskUsecase.getAssignedUsersForManager(taskId);
      res.status(200).json({ status: "success", data: assignedUsers });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  async editTask(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
        const taskId = req.params.taskId; // Get taskId from URL parameters
        const taskData = req.body.taskData; // Get taskData from request body

        // Call the use case to edit the task
        const updatedTask = await this.taskUsecase.editTask(taskId, taskData);
        res.status(200).json({ status: "success", data: updatedTask });
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
}



}       