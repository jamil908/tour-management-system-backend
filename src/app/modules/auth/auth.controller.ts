/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express"
import { catchAsync } from "../../utils/catchAsync"
import { sendResponse } from "../../utils/sendResponse"
import httpStatus from 'http-status-codes'
import { AuthService } from "./auth.service"
import AppError from "../../errorHelpers/appError"
import { setAuthCookie } from "../../utils/setCookie"
import { createUserToken } from "../../utils/usetToken"
import { envVars } from "../../config/env"
import { JwtPayload } from "jsonwebtoken"



const credentialsLogin = catchAsync(async (req : Request ,res : Response, next : NextFunction)=>{
    // const user = await UserServices.createUser(req.body)
    const logginInfo = await AuthService.credentialsLogin(req.body)

   setAuthCookie(res,logginInfo)
   
       sendResponse(res,{
        success :true,
        statusCode : httpStatus.OK,
            message : "LoggedIn successfully",
            data : logginInfo
            
    })
})
const getAccessToken = catchAsync(async (req : Request ,res : Response, next : NextFunction)=>{
    // const user = await UserServices.createUser(req.body)
    const refreshToken = await req.cookies.refreshToken
    if(!refreshToken){
        throw new AppError(httpStatus.BAD_REQUEST,"no refresh token found")
    }
    
    const tokenInfo = await AuthService.getAccessToken(refreshToken )
    //     res.cookie("accessToken",tokenInfo.accessToken ,{
    //     httpOnly:true,
    //     secure : false
    // })
    setAuthCookie(res, tokenInfo)
       sendResponse(res,{
        success :true,
        statusCode : httpStatus.OK,
            message : "refresh token give access token successfully",
            data : tokenInfo
            
    })
})
const logout = catchAsync(async (req : Request ,res : Response, next : NextFunction)=>{

res.clearCookie("accessToken",{
    httpOnly:true,
    secure : false,
    sameSite: 'lax'
})

res.clearCookie("refreshToken",{
    httpOnly:true,
    secure : false,
    sameSite: 'lax'
})
       sendResponse(res,{
        success :true,
        statusCode : httpStatus.OK,
            message : "Logged out successfully",
            data : null
            
    })
})
const resetPassword = catchAsync(async (req : Request ,res : Response, next : NextFunction)=>{
   
    const {newPassword} = req.body
    const {oldPassword} = req.body
    const decodedToken = req.user
    const passwordReset = await AuthService.resetPassword(oldPassword,newPassword,decodedToken as JwtPayload)
       sendResponse(res,{
        success :true,
        statusCode : httpStatus.OK,
            message : "Password reset successfully",
            data : null
            
    })
})
const googleCallbackController = catchAsync(async (req : Request ,res : Response, next : NextFunction)=>{
  let redirectTo = req.query.state ? req.query.state as string : "/";

  if(redirectTo.startsWith("/")){
    redirectTo = redirectTo.slice(1)
  }
  
    const user = req.user;
   if(!user){
    throw new AppError(httpStatus.UNAUTHORIZED,"Google authentication failed")
   }
   const tokenInfo =  createUserToken(user)
   setAuthCookie(res, tokenInfo)
   

    res.redirect(`${envVars.FRONTEND_URL}/${redirectTo}`)
    
        console.log("user",user)
})

export const AuthController = {
    credentialsLogin,
    getAccessToken,
    logout,
    resetPassword,
    googleCallbackController
}