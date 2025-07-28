import AppError from "../../errorHelpers/appError";
import { IUser } from "../user/user.interface"
import httpStatus from 'http-status-codes'
import bcryptjs from 'bcryptjs'
import { User } from "../user/user.model";
import { envVars } from "../../config/env";
import { generateToken } from "../../utils/jwt";


const credentialsLogin = async (payload: Partial<IUser>) => {
    const {email,password}= payload;
     const isUserExist = await User.findOne({email})
        if(!isUserExist){
            throw new AppError(httpStatus.BAD_REQUEST,"email does not exist")
        }
        const isPasswordMatch = await bcryptjs.compare(password as string,isUserExist.password as string)
           if(!isPasswordMatch){
            throw new AppError(httpStatus.BAD_REQUEST,"incorrect password")
        }
        const jwtPayload = {
            userId : isUserExist._id,
            email : isUserExist.email,
            role : isUserExist.role
        }
        const accessToken = generateToken(jwtPayload, envVars.JWT_ACCESS_SECRET,envVars.JWT_ACCESS_EXPIRES)
       
        return {
            accessToken
        }
}
export const AuthService = {
    credentialsLogin
}