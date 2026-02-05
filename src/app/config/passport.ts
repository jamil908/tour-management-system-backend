import passport from "passport";
import { Strategy as googleSrategy, Profile, VerifyCallback } from "passport-google-oauth20";
import { envVars } from "./env";
import { User } from "../modules/user/user.model";
import { Role } from "../modules/user/user.interface";
import { Strategy as localSrategy } from "passport-local";
import bcryptjs from 'bcryptjs'


passport.use(
    new localSrategy(

        {
            usernameField:"email",
            passwordField:"password",

        },
        async(email:string,password:string,done)=>{
            try {
                const user = await User.findOne({email})
                // if(!user){
                //     return done(null,false,{message:"no user found with this email"})
                // }
                if(!user){
                    return done("no user found with this email")
                }
                const isGoogleAuthencticated = user.auths?.some((auths)=> auths.provider == "google")
                // if(isGoogleAuthencticated){
                //     return done(null,false,{message:' you have previously logged in with google please use google login, IF you want to use email and password login , please set your password first.'})
                // }
                if(isGoogleAuthencticated && !user.password){
                    return done(' you have previously logged in with google please use google login, IF you want to use email and password login , please set your password first.')
                }
                const isPasswordMatch = await bcryptjs.compare(password,user.password as string)
                if(!isPasswordMatch){
                    return done(null,false,{message:"incorrect password"})
                }
                return done(null,user)
            } catch (error) {
                console.log("local strategy error",error)
                return done(error)
            }
        }
    )
)

passport.use(
    new googleSrategy(
        {
    clientID : envVars.GOOGLE_CLIENT_ID,
   clientSecret : envVars.GOOGLE_CLIENT_SECRET,
    callbackURL : envVars.GOOGLE_CALLBACK_URL
    },async( accessToken:string,refreshToken:string,profile:Profile,done:VerifyCallback)=>{
        try {
            const email = profile.emails?.[0].value;
            if(!email){
                return done(null,false,{message: " no email found"})
            }

            let user = await User.findOne({email})

            if(!user){
                user = await User.create({
                    email,
                    name:profile.displayName,
                    picture:profile.photos?.[0].value,
                    role:Role.USER,
                    isVerified:true,
                    isActive:true,
                    auths:[
                        {
                            provider:"google",
                            providerId:profile.id
                        }
                    ]
                })

            }
            return done(null,user)
        } catch (error) {
            console.log("google strategy error",error)
            return done(error)
        }
    }
)
);


// eslint-disable-next-line @typescript-eslint/no-explicit-any
passport.serializeUser((user: any, done: (err: any, id?: unknown) =>void )=>{
    done(null, user.id);
} )

// eslint-disable-next-line @typescript-eslint/no-explicit-any
passport.deserializeUser( async (id: string, done:  any, )=>{
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (error) {
        console.log(error)
        done(error,null);
    }
})