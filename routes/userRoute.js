import express from "express"
import { protect } from "../middleware/auth.js";

import { createUser,updateUser,getUsers,deleteUser } from "../controller/userController.js"

const router=express.Router();
router.use(protect);

router.get("/",getUsers);
router.post("/",createUser);
router.get("/", protect, getUsers);
router.put("/:id", protect, updateUser);
router.delete("/:id", protect, deleteUser);

export default router