import mongoose, { Schema, Document } from 'mongoose';

export interface IAuth extends Document{
  email:string;
  password:string
  role:string

}