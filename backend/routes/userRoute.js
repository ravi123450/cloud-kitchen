import express from "express"
import { loginUser,registerUser,getAllUsers,getUserById } from "../controllers/userController.js"

const userRouter = express.Router()

userRouter.post("/register",registerUser)
userRouter.post("/login",loginUser)
userRouter.get("/", getAllUsers)
userRouter.get("/:id", getUserById)

export default userRouter;