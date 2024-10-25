import mongoose from 'mongoose';

export interface JwtPayload {
  id: mongoose.Types.ObjectId; // Use ObjectId for the user ID
  name: string;                // User's name
  role: string;                // User's role
  email: string;  
  departmentId:string             // User's email
}
