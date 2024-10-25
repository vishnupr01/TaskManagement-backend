import mongoose from 'mongoose'; // Import mongoose to use ObjectId
import { Task } from "../frameworks/models/taskModel"; // Import your task model
import ITaskRepository from "../interfaces/repositories/ITask.repository";
import { ITask } from '../entities/task.entity';

export class TaskRepository implements ITaskRepository {
  async getAssignedUsersForManager(managerId: string): Promise<any[]> {
    // Convert managerId to ObjectId
    const managerObjectId = new mongoose.Types.ObjectId(managerId);
    console.log("managerId backend", managerObjectId);

    try {
      const assignedUsers = await Task.aggregate([
        { $match: { assignedBy: managerObjectId } }, // Match tasks assigned by the manager
        {
          $lookup: {
            from: 'users', // The collection name for users
            localField: 'assignedTo', // Field in the Task collection
            foreignField: '_id', // Field in the User collection
            as: 'assignedUsers' // Name of the output array
          }
        },
        {
          $unwind: '$assignedUsers' // Unwind the array for better access
        },
        {
          $replaceRoot: { newRoot: '$assignedUsers' } // Replace root to get user details directly
        },
        {
          $group: {
            _id: '$_id',
            name: { $first: '$name' }, // Adjust to your user fields
            email: { $first: '$email' }
          }
        }
      ]);

      return assignedUsers;
    } catch (error) {
      console.error("Error fetching assigned users:", error); // Log error for debugging
      throw error;
    }
  }

  async createTask(taskData: ITask): Promise<ITask> {
    try {
      const task = new Task({
        title: taskData.title,
        assignedTo: taskData.assignedTo,
        createdBy: taskData.createdBy,
        start: taskData.start,
        end: taskData.end,
        allDay: taskData.allDay || false, // Defaults to false if not provided
        departmentId: taskData.departmentId,
        status: 'Pending' // Default to 'Pending' if not specified
      });

      // Save the task to the database
      const savedTask = await task.save();
      return savedTask;
    } catch (error) {
      console.error("Error creating task:", error); // Log error for debugging
      throw error;
    }
  }

  async getTasksCreatedByManager(managerId: string): Promise<ITask[]> {
    const managerObjectId = new mongoose.Types.ObjectId(managerId);
    console.log("managerId for createdBy tasks:", managerObjectId);

    try {
      // Find tasks where createdBy matches the manager's ObjectId
      const tasks = await Task.find({ createdBy: managerObjectId });
      return tasks;
    } catch (error) {
      console.error("Error fetching tasks created by manager:", error); // Log error for debugging
      throw error;
    }
  }
  async deleteTask(taskId: string): Promise<boolean> {
    const taskObjectId = new mongoose.Types.ObjectId(taskId); // Convert taskId to ObjectId
    try {
      const result = await Task.deleteOne({ _id: taskObjectId }); // Delete the task by ID
      if (result.deletedCount === 0) {
        throw new Error("Task not found");
      }
      if(result){
        return true
      }else{
        return false
      }
    
    } catch (error) {
      console.error("Error deleting task:", error); // Log error for debugging
      throw error;
    }
  }
}
