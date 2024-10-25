import mongoose from "mongoose";
import { IUser } from "../entities/user.entity";
import { comparePassword, hashPassword } from "../frameworks/utils/bcrypt";
import IUserRepository from "../interfaces/repositories/IUser.repository";
import IUserUseCase from "../interfaces/useCase/IUser.useCase";
import validator from 'validator'
import IDepartmentRepository from "../interfaces/repositories/Idepartment.repository";
import { generateOTP } from "../frameworks/utils/generateOtp";
import { sendEmail } from "../frameworks/utils/sendEmail";
import { IAuth } from "../entities/IAuth";
import { createJWT } from "../frameworks/utils/jwt";
import { IDepartment } from "../entities/department.entity";

export class UserUsecase implements IUserUseCase {
  private userRepository: IUserRepository
  private departmentRepository: IDepartmentRepository
  constructor(userRepository: IUserRepository, departmentRepository: IDepartmentRepository) {
    this.userRepository = userRepository
    this.departmentRepository = departmentRepository
  }

  async userRegister(data: IUser): Promise<IUser> {
    try {
      const { name, email, password, role, department } = data
      console.log(name);
      console.log("role",role);
      if (!name.trim() || !email || !password || !role) {
        throw new Error("credential error")
      }
      if (!validator.isEmail(email)) {
        throw new Error("Invalid email format");
      }

      // Validate password strength (min 8 characters, 1 uppercase, 1 lowercase, 1 number, 1 special character)
      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
      if (!passwordRegex.test(password)) {
        throw new Error(
          "Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, one number, and one special character"
        );
      }
      const isEmailExists = await this.userRepository.findUserByEmail(email)
      if (isEmailExists) {
        throw new Error("Email exists")
      }
      let managerId = null
      if (role === "Employee") {
        managerId = await this.userRepository.findManagerByDepartment(department)

        if (managerId === null || managerId === undefined) {
          throw new Error("Department doesn't exist")
        }

      }else{
        const existingDepartment=await this.departmentRepository.departmentNameExists(department)
        if(existingDepartment!==null){
          throw new Error("Department already exists")
        }
      }
      //if the role is "manager"
      const hashedPassword = await hashPassword(password)
      const userData: IUser = {
        name: name,
        email: email,
        role: role,
        department: department,
        password: hashedPassword,
        managerId: managerId || null,

      } as IUser
      const savedUser = await this.userRepository.registerUser(userData)
  
      
      if (role === "Manager") {
        if (!department.trim()) {
          throw new Error("Department name is required for manager")
        }
        const newDepartment = await this.departmentRepository.createDepartment(department, savedUser._id as string)
      }
      await this.sendOtp(email, "OTP for TaskManagement")
      return savedUser
    } catch (error) {
      throw error
    }

  }

  async sendOtp(email: string, subject: string) {
    try {
      const otp = generateOTP(4)
      console.log("email:",email,"otP:",otp);
      
      await this.userRepository.saveOtp(email, otp) 
      await sendEmail(email, subject, `your otp is ${otp}`)

    } catch (error) {
      throw new Error('otp sending failed')
    }
  }
  async resendOtp(email: string, subject: string): Promise<void> {
    this.sendOtp(email, subject);
  }

  async verifyOtp(email: string, otp: string): Promise<boolean> {
    try {
      if (!email || !otp) {
        throw new Error("missing email or Otp")
      }
      const otpVerified = await this.userRepository.verifyOtp(email, otp)
      await this.userRepository.verifyUser(email)
      if (otpVerified) {
        return true
      }
      return false
    } catch (error) {
      console.log("ERROR IN verify otp", error);
      throw error

    }
  }

  async userSigin(data: IAuth): Promise<any> {
    try {
      if (!data.email || !data.password) {
        throw new Error('Email and password are required');
      }
      if (!data.role) {
        throw new Error('Select your role');
      }
      const { user, verified } = await this.userRepository.checkEmailAndVerifiedStatus(data.email);
      if (!user || user === null) {
        throw new Error("User not found")
      }
      const role = await this.userRepository.checkUserRoleByEmail(data.email)
      if (role !== data.role) {
        throw new Error("trying to loging invalid portal")
      }
      if (!verified) {
        throw new Error("User not verified")
      }
      console.log("mypass", data.password);
      console.log("dbpass", user);


      const isMatch = await comparePassword(data.password, user.password)
      if (!isMatch) {
        throw new Error("password is incorrect")
      }
      const department:any=await this.departmentRepository.departmentNameExists(user.department)
      console.log("my department",department);
      
      const payload = { id: user._id, name: user.name,managerId:user?.managerId, role: user.role, email: user.email,departmentId:department?._id }
      console.log(payload,"paylod logiinee");
      
      const token = createJWT(payload, 5)
      return token
    } catch (error) {
      throw error
    }

  }
  async departmentNames(): Promise<string[]> {
    try {
      const departments = await this.departmentRepository.getAllDepartmentNames()
      return departments
    } catch (error) {
      throw error
    }
  }
}