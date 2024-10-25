import { IAuth } from "../../entities/IAuth";
import { IUser } from "../../entities/user.entity";

export default interface IUserUseCase{
  userRegister(data: IUser): Promise<IUser>
  verifyOtp(email: string, otp: string): Promise<boolean>
  resendOtp(email: string, subject: string): Promise<void>
  userSigin(data: IAuth): Promise<any>
  departmentNames(): Promise<string[]> 
  
  
}