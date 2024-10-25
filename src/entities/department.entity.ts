import mongoose from "mongoose";

export interface IDepartment extends Document {
  name: string;
  manager: mongoose.Types.ObjectId; // Reference to the manager
}