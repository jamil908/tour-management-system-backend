
import express, {  Request,  Response } from "express";
import cors from "cors"
import { router } from "./app/routes";
import { globalError } from "./app/middlewere/globalErrorHandler";
import NotFound from "./app/middlewere/notFound";

const app = express();
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