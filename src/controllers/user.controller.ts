import { NextFunction, Request, Response } from "express";
import IUserUseCase from "../interfaces/useCase/IUser.useCase";
import { IAuth } from "../entities/IAuth";
import { AuthenticatedRequest } from "../frameworks/middlewares/authMiddleware";
import { JwtPayload } from "../entities/jwt";

export class UserController {
  private userUsecase: IUserUseCase
  constructor(userUseCase: IUserUseCase) {
    this.userUsecase = userUseCase
  }

  async register(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = req.body.formData
      console.log(data);

      const newUser = await this.userUsecase.userRegister(data)
      console.log("hey", newUser);

      res.status(201).json({ status: "success", data: newUser })
    } catch (error: any) {
      res.status(400).json({ message: error.message })
    }
  }
  async verifyOtp(req: Request, res: Response, next: NextFunction) {
    try {
      const body = req.body
      console.log("hey",body);
      
      const data = await this.userUsecase.verifyOtp(body.email, body.otp)
      res.status(200).json({ status: "success", data: data })
    } catch (error: any) {
      res.status(400).json({ message: error.message })
    }
  }
  async resendOtp(req: Request, res: Response, next: NextFunction) {
    try {
      const { email } = req.body
      const response = await this.userUsecase.resendOtp(email, "otp for WETALKS")
      res.status(200).json({ status: 'success', data: response })

    } catch (error: any) {
      console.log(error);
      res.status(400).json({ message: error.message })

    }
  }
  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password, role } = req.body.data
      const data: IAuth = {
        email: email,
        password: password,
        role: role
      } as IAuth
      const token = await this.userUsecase.userSigin(data)
      res.cookie('authToken', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'none',
        maxAge: 15 * 24 * 60 * 60 * 1000 // 8 hours
      })
      res.status(200).json({ status: 'success', token: token, role: role })
    } catch (error: any) {
      console.log(error);
      res.status(400).json({ message: error.message })
    }
  }
  async getDepartmentNames(req: Request, res: Response, next: NextFunction) {
    try {
      const response = await this.userUsecase.departmentNames()
      res.status(200).json({ status: 'success', data: response })
    } catch (error: any) {
      res.status(400).json({ message: error.message })
    }
  }

  async reSendOtp(req: Request, res: Response, next: NextFunction) {
    try {
      const email = req.body.email
      const response = await this.userUsecase.resendOtp(email, "OTP for TaskManagement")
      res.status(200).json({ status: 'success', data: response })

    } catch (error: any) {
      res.status(400).json({ message: error.message })

    }
  }
  async isUser(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const user = req.user as JwtPayload
      const departmentId=user.departmentId
      if (req.user) {
        console.log("api working ");
        return res.status(200).json({ message: 'user is authenticated', user: user,departmentId:departmentId })
      } else {
        return res.status(200).json({ message: 'user is not authenticated' })
      }
    } catch (error: any) {
      res.status(400).json({ message: error.message })
    }
  }

  async logOut(req: Request, res: Response, next: NextFunction) {
    res.clearCookie('authToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'none'
    });
    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'none'
    });
    res.status(200).json({ status: 'success', message: 'Logged out successfully' });

  }

}