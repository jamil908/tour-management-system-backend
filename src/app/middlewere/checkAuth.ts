import { NextFunction, Request, Response } from "express";
import AppError from "../errorHelpers/appError";
import { envVars } from "../config/env";
import { verifyToken } from "../utils/jwt";
import { JwtPayload } from "jsonwebtoken";

export const checkAuth = (...authRoles : string[])=>async (req : Request ,res : Response, next : NextFunction)=>{
  try {
    const accessToken = req.headers.authorization;
    if(!accessToken){
      throw new AppError(403,"did not recieved token")
    }
    const verifiedToken = verifyToken(accessToken,envVars.JWT_ACCESS_SECRET) as JwtPayload
   console.log("verify token")
    if(!authRoles.includes(verifiedToken.role)){
      throw new AppError(403,"You are not permited to view this route")
    }
    req.user = verifiedToken
    next()
  } catch (error) {
    next(error)
  }
} 