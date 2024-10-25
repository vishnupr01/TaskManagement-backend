import { ITask } from "../../entities/task.entity"

export default interface ITaskUseCase{
  getEmployees(managerId: string):Promise<any[]>
  createTask(taskData: ITask): Promise<ITask>
  getTasksByManager(managerId: string): Promise<ITask[]> 
  deleteTask(taskId: string): Promise<boolean> 
  getAssignedUsersForManager(taskId: string): Promise<any[]>
  
}