import express from "express";
import { deleteUser, getUser, getUsers, login, register, verifyEmail } from "../controllers/user.js";
import { verifyUser } from "../utils/verifyToken.js";

const router = express.Router();

//CREATE new user
router.post("/", register);

//Verify User
router.get('/verify/:token', verifyEmail);

//LOGIN User
router.post("/login",login )

//GET  User
router.get("/:id",verifyUser, getUser);

//GET ALL users
router.get("/",  getUsers)

//DELETE  user
router.delete("/:id",verifyUser, deleteUser);


export default router