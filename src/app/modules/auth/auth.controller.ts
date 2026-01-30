/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express"
import { catchAsync } from "../../utils/catchAsync"
import { UserServices } from "../user/user.service"
import { sendResponse } from "../../utils/sendResponse"
import httpStatus from 'http-status-codes'
import { AuthService } from "./auth.service"
const credentialsLogin = catchAsync(async (req : Request ,res : Response, next : NextFunction)=>{
    // const user = await UserServices.createUser(req.body)
    const logginInfo = await AuthService.credentialsLogin(req.body)
       sendResponse(res,{
        success :true,
        statusCode : httpStatus.OK,
            message : "LoggedIn successfully",
            data : logginInfo
            
    })
})

export const AuthController = {
    credentialsLogin
}