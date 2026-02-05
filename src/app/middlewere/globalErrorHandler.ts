/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express"
import { envVars } from "../config/env"
import AppError from "../errorHelpers/appError"
import mongoose from "mongoose"



const handleDuplicateError = (err:any)=>{
    const duplicateField = err.message.match(/"([^"]*)"/)
    const message = `Duplicate field value entered: ${duplicateField[1]}`
    return {
      statusCode:400,
      message:message
    }
}
const handleCastError = (err: mongoose.Error.CastError)=>{
 return{
    statusCode:400,
      message: "invalid mongodb object id .please provide correct id"
 }
}
const handleValidationError = (err: mongoose.Error.ValidationError)=>{
 
     const errorSource = []
     const errors = Object.values(err.errors)
       
        errors.forEach((errorObject : any) => {
          
          errorSource.push({
            path: errorObject.path,
            message: errorObject.message
          })
        })
      
        return {
          statusCode:400,
           message : "validation error"
        }
}
export const globalError = (err :any ,req :Request,res:Response,next :NextFunction)=>{


     const errorSource : any= [
      // {
          // path:"isDeleted",
          // message: "Cast Failed"
        // }
      ]
      let statusCode =500
    let message = `Something went wrong ${err.message}form global error`

    if(err.message === 11000){
     const simplifiedError = handleDuplicateError(err)
      message = simplifiedError.message
      statusCode =simplifiedError.statusCode
 
    }else if(err.name === "CastError"){
      const simplifiedError = handleCastError(err)
      statusCode = simplifiedError.statusCode;
      message = simplifiedError.message
    }
    else if(err.name === "ZodError"){
        statusCode = 400;
        message = "Zod Validation error"
        err.issues().forEach((issue : any)=>{
          errorSource.push({
            path : issue.path[issue.path.length -1],
            message: issue.message
          })
        })
    }
    // mongoose validation error
    else if(err.name === "ValidationError"){
        statusCode = 400;
        // ✅ this is the correct way to extract validation error messages got it from ai
        // message = Object.values(err.errors).map((el : any) => el.message).join(", ")
        const errors = Object.values(err.errors)
       
        errors.forEach((errorObject : any) => {
          errorSource.push({
            path: errorObject.path,
            message: errorObject.message
          })
        })
        message = "validation error"
    }
    else if(err instanceof AppError){
        statusCode = err.statusCode,
        message = err.message
    }else if(err instanceof Error){
      statusCode = 500,
      message = err.message
    }

  res.status(statusCode).json({
    success:false,
              message,
              err,
              errorSource,
              stack :envVars.NODE_ENV === "development" ? err.stack : null
          })
}