import { UserController } from "./user.controller";
import { createUserZodSchema, updateUserZodSchema } from "./user.validation";
import { validRequest } from "../../middlewere/valadiateRequest";
import { Router } from "express";

import { checkAuth } from "../../middlewere/checkAuth";
import { Role } from "./user.interface";


const router = Router();



router.post(
  "/register", 
  validRequest(createUserZodSchema),
  UserController.createUser
);
router.get("/all-User", checkAuth(Role.ADMIN,Role.SUPER_ADMIN),UserController.getAllUsers);
router.patch("/:id",validRequest(updateUserZodSchema),checkAuth(...Object.values(Role)),UserController.updateUser)


export const UserRoutes = router;
