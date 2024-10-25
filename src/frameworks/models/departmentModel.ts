import mongoose, { Schema, Document } from 'mongoose';
import { IDepartment } from '../../entities/department.entity';



const DepartmentSchema: Schema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true
  }, // Department name
  manager: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }, // Reference to the Manager's User ID
}, { timestamps: true }); 

export const Department = mongoose.model<IDepartment>('Department', DepartmentSchema);
