import { ITask } from "../../entities/task.entity"

export default interface ITaskRepository{
 
  createTask(taskData: ITask): Promise<ITask>
  getTasksCreatedByManager(managerId: string): Promise<ITask[]>
  deleteTask(taskId: string): Promise<boolean>
  getTaskAssignedUsersForManager(taskId: string): Promise<any[]>
  editTask(taskId: string, taskData: Partial<ITask>): Promise<ITask>
  
}