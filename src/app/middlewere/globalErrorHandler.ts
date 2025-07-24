/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express"
import { envVars } from "../config/env"
import AppError from "../errorHelpers/appError"




// eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
export const globalError = (err :any ,req :Request,res:Response,next :NextFunction)=>{

      let statusCode =500
    let message = `Something went wrong ${err.message}form global error`
    if(err instanceof AppError){
        statusCode = err.statusCode,
        message = err.message
    }

  res.status(500).json({
    success:false,
              message,
              err,
              stack :envVars.NODE_ENV === "development" ? err.stack : null
          })
}