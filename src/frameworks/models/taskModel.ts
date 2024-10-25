import mongoose, { Schema, Document } from 'mongoose';
import { ITask } from '../../entities/task.entity';

const TaskSchema: Schema = new Schema({
  title: {
    type: String,
    required: true
  },
  assignedTo: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true // Reference to the users assigned to the task
  }],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true // Reference to the user who created the task
  },
  start: {
    type: Date,
    required: true // Start date and time for the task
  },
  end: {
    type: Date,
    required: true // End date and time for the task
  },
  allDay: {
    type: Boolean,
    default: false // Indicates if the task is an all-day event
  },
  departmentId: {
    type: mongoose.Schema.Types.ObjectId, // Reference to the department for the task
    ref: 'Department',
    required: true
  },
  status: {
    type: String,
    enum: ['Pending', 'In Progress', 'Completed'],
    default: 'Pending'
  }
}, { timestamps: true });

export const Task = mongoose.model<ITask>('Task', TaskSchema);
