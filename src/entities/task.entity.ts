import mongoose, { Schema, Document } from 'mongoose';

export interface ITask extends Document {
  title: string;
  assignedTo: mongoose.Types.ObjectId[]; // Changed to an array to hold multiple ObjectIds
  createdBy: mongoose.Types.ObjectId; // Renamed from assignedBy to createdBy
  start: Date; // Added to capture the start date and time
  end: Date; // Added to capture the end date and time
  allDay?: boolean; // Optional field to indicate if the task is all-day
  departmentId: mongoose.Types.ObjectId; // Reference to the department
  status: 'Pending' | 'In Progress' | 'Completed'; // Task status
}
