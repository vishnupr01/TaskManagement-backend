import { ITask } from "../entities/task.entity";
import ITaskRepository from "../interfaces/repositories/ITask.repository";
import IUserRepository from "../interfaces/repositories/IUser.repository";
import ITaskUseCase from "../interfaces/useCase/ITask.useCase";

export class TaskUsecase implements ITaskUseCase {
  private taskRepository: ITaskRepository
  private userRepository:IUserRepository
  constructor(taskRepository: ITaskRepository,userRepository:IUserRepository) {
    this.taskRepository = taskRepository
    this.userRepository=userRepository
  }
  async getEmployees(managerId: string): Promise<any[]> {
    try {
      if (!managerId) {
        throw new Error("credential getEmployee error")
      }
      const employees = await this.userRepository.getUsersByManagerId(managerId)
      return employees

    } catch (error) {
      throw new Error('employees error')
    }
  }
  async createTask(taskData: ITask): Promise<ITask> {
    try {
      // Validate required fields
      console.log("users input",taskData);
      
      if (!taskData.title || !taskData.assignedTo || !taskData.createdBy || !taskData.start || !taskData.end || !taskData.departmentId) {
        throw new Error("Missing required task data fields");
      }
      // Ensure that start and end dates are valid
      console.log(taskData.start,taskData.end);
      
      if (taskData.start > taskData.end) {
        throw new Error("Start date must be earlier than end date");
      }
      const newTask = await this.taskRepository.createTask(taskData);
      return newTask;
      
    } catch (error) {
      console.error("Error creating task:", error);
      throw new Error("Task creation failed");
    }
  }
  async getTasksByManager(managerId: string): Promise<ITask[]> {
    try {
      if (!managerId) {
        throw new Error("Manager ID is required to get tasks");
      }
      // Retrieve tasks created by the manager
      const tasks = await this.taskRepository.getTasksCreatedByManager(managerId);
      return tasks;
    } catch (error) {
      console.error("Error fetching tasks for manager:", error);
      throw new Error("Failed to retrieve tasks for the manager");
    }
  }
  async deleteTask(taskId: string): Promise<boolean> {
    try {
      if (!taskId) {
        throw new Error("Task ID is required to delete the task");
      }
      const result=await this.taskRepository.deleteTask(taskId);
      return result
    } catch (error) {
      console.error("Error deleting task:", error);
      throw new Error("Task deletion failed");
    }
  }
  async getAssignedUsersForManager(taskId: string): Promise<any[]> {
    try {
      if (!taskId) {
        throw new Error("Manager ID is required");
      }
      const assignedUsers = await this.taskRepository.getTaskAssignedUsersForManager(taskId);
      return assignedUsers;
    } catch (error) {
      console.error("Error in getAssignedUsersForManager use case:", error);
      throw new Error("Failed to retrieve assigned users");
    }
  }

}