import mongoose from "mongoose";
import { IUser } from "../entities/user.entity";
import { User } from "../frameworks/models/userModel";
import IUserRepository from "../interfaces/repositories/IUser.repository";
import { Department } from "../frameworks/models/departmentModel";
import { OtpModel } from "../frameworks/models/otpModel";

export class UserRepository implements IUserRepository {

  async registerUser(data: IUser): Promise<IUser> {
    try {
      const user = new User({
        name: data.name,
        email: data.email,
        role: data.role,
        managerId: data.managerId,
        department: data.department,
        password: data.password,
      });
      const savedUser = await user.save()
      return savedUser
    } catch (error) {
      console.error("Error registering user:", error);
      throw new Error("User registration failed");
    }

  }

  async findUserByEmail(email: string): Promise<boolean> {
    try {
      const user = await User.findOne({ email });
      return user !== null;
    } catch (error) {
      console.error("Error checking user existence:", error);
      throw new Error("Could not check user existence");
    }
  }

  async findManagerByDepartment(departmentName: string): Promise<mongoose.Types.ObjectId | undefined> {
    try {
      console.log(departmentName);

      const department = await Department.findOne({ name: departmentName }).select('manager');
      console.log("hey here", department);
      // Select the 'manager' field
      return department?.manager as mongoose.Types.ObjectId | undefined;
    } catch (error) {
      console.error("Error finding manager by department:", error);
      throw new Error("Could not find manager for the specified department");
    }
  }

  async saveOtp(email: string, otp: string): Promise<string> {
    try {
      const expiry = new Date()
      expiry.setTime(expiry.getTime() + 5 * 60 * 1000);
      const newOtp = new OtpModel({
        email: email,
        otp: otp,
        expiry: expiry
      })
      await newOtp.save()
      return otp

    } catch (error) {
      throw new Error("Error found in otp")

    }
  }

  async verifyOtp(email: string, otp: string): Promise<string> {
    try {
      const otpFound = await OtpModel.findOne({ email: email, otp: otp }).sort({ expiry: -1 })
      if (!otpFound) {
        throw new Error("Invalid otp")
      }
      if (!otpFound.expiry || otpFound.expiry < new Date) {
        throw new Error("OTP expired")
      }
      return "OTP verified successfully"
    } catch (error) {
      console.log("error in verifying otp");

      throw error
    }

  }
  async verifyUser(email: string): Promise<IUser | null> {
    try {
      const updatedUser = await User.findOneAndUpdate(
        { email: email },
        { $set: { verified: true } },
        { new: true }
      );

      return updatedUser ? updatedUser.toJSON() as IUser : null;
    } catch (error) {
      throw error;
    }
  }
  async checkEmailAndVerifiedStatus(email: string): Promise<{ user: IUser | null, verified: boolean | undefined }> {
    try {
      const user = await User.findOne({ email })
      return { user: user, verified: user?.verified };
    } catch (error) {
      console.error("Error checking email and verification status:", error);
      throw new Error("Could not check email and verification status");
    }
  }
  async checkUserRoleByEmail(email: string,): Promise<string | null> {
    try {

      const user = await User.findOne({ email }).select('role');
      return user?.role as string | null
    } catch (error) {
      console.error("Error checking user role by email:", error);
      throw new Error("Could not verify user role");
    }
  }
  async getUsersByManagerId(managerId: string): Promise<IUser[]> {
    try {
        console.log(managerId, "managerId here");

        // Convert the string to a mongoose ObjectId
        const convertedManagerId = new mongoose.Types.ObjectId(managerId);
        
        // Query to find all users with the specified managerId
        const users = await User.find({ managerId: convertedManagerId }).exec();
        console.log("got",users);
         // Use exec() to return a promise
        return users.map(user => user.toJSON() as IUser); // Convert Mongoose documents to plain objects
    } catch (error) {
        console.error("Error retrieving users by manager ID:", error);
        throw new Error("Could not retrieve users for the specified manager");
    }
}


}