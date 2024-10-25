import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: 'Employee' | 'Manager'; 
  managerId: mongoose.Types.ObjectId | null;
  verified?: boolean; 
  department: string;
}
