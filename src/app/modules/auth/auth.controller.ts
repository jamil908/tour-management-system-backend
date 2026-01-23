/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express"
import { catchAsync } from "../../utils/catchAsync"
import { sendResponse } from "../../utils/sendResponse"
import httpStatus from 'http-status-codes'
import { AuthService } from "./auth.service"
import AppError from "../../errorHelpers/appError"
import { setAuthCookie } from "../../utils/setCookie"



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
            message : "LoggedIn successfully",
            data : tokenInfo
            
    })
})

export const AuthController = {
    credentialsLogin,
    getAccessToken
}