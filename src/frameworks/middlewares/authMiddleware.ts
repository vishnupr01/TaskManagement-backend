import { Request, Response, NextFunction } from 'express'


import { error } from 'console'
import { verifyJWT } from '../utils/jwt'
import { User } from '../models/userModel'
import { JwtPayload } from '../../entities/jwt'

export interface AuthenticatedRequest extends Request {
  user?: JwtPayload
}
export const authMiddleware = async (req: AuthenticatedRequest, res: Response, next: NextFunction):Promise<any> => {
  try {
    const authToken = req.cookies?.authToken
    if (!authToken) {
      return res.status(200).json({ message: "not authenticated" })
    }

    const userData = verifyJWT(authToken) as JwtPayload


    if (!userData) {
      return res.status(200).json({ message: "Unauthorized" })
    }
    const user = await User.findById(userData.id)


    if (!user) {
      return res.status(404).json({ message: 'user not found' })
    }
    
    req.user = userData
    next()

  } catch (error: any){
    if (error.message === 'TokenExpired') {
      return res.status(401).json({ message: 'Token expired' });
    } else if (error.message === 'InvalidToken') {
      return res.status(401).json({ message: 'Invalid token' });
    } else {
      return res.status(500).json({ message: 'Server error' }); 
    }

  }


}
