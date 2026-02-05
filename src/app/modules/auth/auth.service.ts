import AppError from "../../errorHelpers/appError";
import httpStatus from 'http-status-codes'
import bcryptjs from 'bcryptjs'
import { User } from "../user/user.model";
import { createNewAccessTokenWithRefreshToken } from "../../utils/usetToken";
import { JwtPayload } from "jsonwebtoken";
import { envVars } from "../../config/env";


// const credentialsLogin = async (payload: Partial<IUser>) => {
//     const {email,password}= payload;
//      const isUserExist = await User.findOne({email})
//         if(!isUserExist){
//             throw new AppError(httpStatus.BAD_REQUEST,"email does not exist")
//         }
//         const isPasswordMatch = await bcryptjs.compare(password as string,isUserExist.password as string)
//            if(!isPasswordMatch){
//             throw new AppError(httpStatus.BAD_REQUEST,"incorrect password")
//         }
//       const createTokens = createUserToken(isUserExist)
      
//         // eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unsafe-optional-chaining
//       const {password : pass, ...userData} = isUserExist?.toObject()
//        return {
//             accessToken: createTokens.accessToken,
//             refreshToken: createTokens.refreshToken,
//             user : userData
//         }
// }
const getAccessToken = async (refreshToken : string) => {
 const {accessToken} = await createNewAccessTokenWithRefreshToken(refreshToken)
 return {
    accessToken  
 }
}
const resetPassword = async (oldPassword : string, newPassword : string , decodedToken : JwtPayload) => {
 
    const user = await User.findById(decodedToken.userId)
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const isOldPasswordMatch = await bcryptjs.compare(oldPassword , user!.password as string)
    if(!isOldPasswordMatch){
        throw new AppError(httpStatus.BAD_REQUEST,"old password is incorrect")
    }
     // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
     user!.password =   await bcryptjs.hash(newPassword,Number(envVars.BCRYPT_SALT_ROUND))
 user?.save()
 
}

export const AuthService = {
    // credentialsLogin,
    getAccessToken,
    resetPassword
}