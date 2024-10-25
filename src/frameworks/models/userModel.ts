import mongoose, { Schema, Document } from 'mongoose';
import { IUser } from '../../entities/user.entity';

const UserSchema: Schema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true // Ensure emails are unique
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['Employee', 'Manager'],
    required: true
  },
  managerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to the user's manager
    default: null
  },
  department: {
    type: String, // Reference to the department
    ref: 'Department',
    required: true
  },
  verified: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

export const User = mongoose.model<IUser>('User', UserSchema);


