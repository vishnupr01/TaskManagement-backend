import { ITask } from "../../entities/task.entity"

export default interface ITaskRepository{
  getAssignedUsersForManager(managerId: string): Promise<any[]> 
  createTask(taskData: ITask): Promise<ITask>
  getTasksCreatedByManager(managerId: string): Promise<ITask[]>
  deleteTask(taskId: string): Promise<boolean>
  
}