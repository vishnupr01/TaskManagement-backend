import { IDepartment } from "../../entities/department.entity";

export default interface IDepartmentRepository {
  createDepartment(name: string, managerId: string): Promise<IDepartment> 
  getAllDepartmentNames(): Promise<string[]>
  departmentNameExists(name: string): Promise<IDepartment | null> 
}