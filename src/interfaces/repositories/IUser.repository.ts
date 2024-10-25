import mongoose from "mongoose";
import { IUser } from "../../entities/user.entity";

export default interface IUserRepository {
  registerUser(data: IUser): Promise<IUser>
  findUserByEmail(email: string): Promise<boolean>
  findManagerByDepartment(departmentName: string): Promise<mongoose.Types.ObjectId | undefined>
  saveOtp(email: string, otp: string): Promise<string>
  verifyUser(email: string): Promise<IUser | null>
  verifyOtp(email: string, otp: string): Promise<string>
  checkEmailAndVerifiedStatus(email: string): Promise<{ user: IUser | null, verified: boolean | undefined }>
  checkUserRoleByEmail(email: string,): Promise<string | null> 
  getUsersByManagerId(managerId: string): Promise<IUser[]>
 
}