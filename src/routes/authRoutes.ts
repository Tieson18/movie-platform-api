import { Router } from "express";
import { AuthController } from "../controllers/authController.js";
import { validate } from "../middleware/validate.js";
import { LoginUserSchema, RegisterUserSchema } from "../validations/user.validation.js";

const authRouter = Router();

authRouter.post("/auth/register", validate(RegisterUserSchema), AuthController.register);
authRouter.post("/auth/login", validate(LoginUserSchema), AuthController.login);

export default authRouter;
