import { Router } from "express";
import { login, register, sendMail } from "../controllers/auth.controller";



const authRouter:Router = Router()



authRouter.post("/register", register)
authRouter.post("/login", login)
authRouter.post("/send-mail", sendMail)


export default authRouter