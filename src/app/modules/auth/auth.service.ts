import AppError from "../../errorHelpers/appError";
import { IUser } from "../user/user.interface"
import httpStatus from 'http-status-codes'
import bcryptjs from 'bcryptjs'
import { User } from "../user/user.model";
import { createNewAccessTokenWithRefreshToken, createUserToken } from "../../utils/usetToken";


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
      const createTokens = createUserToken(isUserExist)
      
        // eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unsafe-optional-chaining
      const {password : pass, ...userData} = isUserExist?.toObject()
       return {
            accessToken: createTokens.accessToken,
            refreshToken: createTokens.refreshToken,
            user : userData
        }
}
const getAccessToken = async (refreshToken : string) => {
 const {accessToken} = await createNewAccessTokenWithRefreshToken(refreshToken)
 return {
    accessToken 
 }
}

export const AuthService = {
    credentialsLogin,
    getAccessToken
}