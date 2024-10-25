import { IDepartment } from "../entities/department.entity";
import { Department } from "../frameworks/models/departmentModel";
import IDepartmentRepository from "../interfaces/repositories/Idepartment.repository";

export class DepartmentRepository implements IDepartmentRepository {
  async createDepartment(name: string, managerId: string): Promise<IDepartment> {
    try {
      const newDepartment = new Department({
        name,
        manager: managerId,
      });

      const savedDepartment = await newDepartment.save();

      return savedDepartment;
    } catch (error) {
      throw error;
    }
  }
  async getAllDepartmentNames(): Promise<string[]> {
    try {
      const departments = await Department.find({}, 'name'); // Only fetch the name field
      return departments.map(department => department.name);
    } catch (error) {
      throw error;
    }
  }

  async departmentNameExists(name: string): Promise<IDepartment | null> {
    try {
      const existingDepartment = await Department.findOne({ name });
      return existingDepartment
    } catch (error) {
      throw error
    }
  }
} 