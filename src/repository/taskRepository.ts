import mongoose from 'mongoose'; // Import mongoose to use ObjectId
import { Task } from "../frameworks/models/taskModel"; // Import your task model
import ITaskRepository from "../interfaces/repositories/ITask.repository";
import { ITask } from '../entities/task.entity';

export class TaskRepository implements ITaskRepository {
  async getTaskAssignedUsersForManager(taskId: string): Promise<any[]> {
    const taskObjectId = new mongoose.Types.ObjectId(taskId);
    console.log("Task ID for assigned users:", taskObjectId);
  
    try {
      // Step 1: Find the task and get the list of assigned user IDs
      const task = await Task.findById(taskObjectId).select('assignedTo');
  
      if (!task) {
        throw new Error("Task not found");
      }
  
      const assignedUserIds = task.assignedTo || []; // Array of user IDs assigned to the task
  
      // Step 2: Find users in the assignedUserIds list
      const assignedUsers = await mongoose.model('User').find({
        _id: { $in: assignedUserIds } // Include only users in the assignedTo list
      }).select('_id name email'); // Include only desired fields
   console.log("assignedusers",assignedUsers);
   
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
      if (result) {
        return true
      } else {
        return false
      }

    } catch (error) {
      console.error("Error deleting task:", error); // Log error for debugging
      throw error;
    }
  }
}
