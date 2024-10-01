import { Router } from "express";
import { login, register } from "../controllers/user.controller";

// creating router
const router = Router();

// defining routes
router.post("/create", register);
router.post("/login", login);

// exporting router
export default router;
