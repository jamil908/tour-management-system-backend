/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response, Router } from "express";
import { AuthController } from "./auth.controller";
import { checkAuth } from "../../middlewere/checkAuth";
import { Role } from "../user/user.interface";
import passport from "passport";




const router = Router();
router.post('/login',AuthController.credentialsLogin)
router.post('/refresh-token',AuthController.getAccessToken)
router.post('/logout',AuthController.logout)
router.post('/reset-password',checkAuth(...Object.values(Role)), AuthController.resetPassword)
router.get('/google',async (req:Request,res:Response,next:NextFunction)=>{
    const redirect = req.query.redirect || "/";
    passport.authenticate('google',{scope:["profile","email"],state: redirect as string})(req,res)
})
router.get('/google/callback',passport.authenticate('google',{failureRedirect:'/login'}),AuthController.googleCallbackController)
export const AuthRouter = router;