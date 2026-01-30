
import express, {  Request,  Response } from "express";
import cors from "cors"
import { router } from "./app/routes";
import { globalError } from "./app/middlewere/globalErrorHandler";
import NotFound from "./app/middlewere/notFound";
import cookieParser from "cookie-parser";
import passport from "passport";
import expressSession from "express-session"
import "./app/config/passport"
import { envVars } from "./app/config/env";

const app = express();


app.use(expressSession({
  secret: envVars.EXPRESS_SESSION_SECRET,
  resave:false,
  saveUninitialized:false
}))
app.use(passport.initialize());
app.use(passport.session())
app.use(cookieParser())
app.use(express.json())
app.use(cors())
app.use("/api/v1",router)

app.get('/', (req :Request ,res : Response) => {
  res.status(200).json({
    message : 'welcome tour management system backend'
  })
})

app.use(globalError)

app.use(NotFound)
export default app;