import { Router } from "express";
import { login, logout, register } from "../controllers/user.controller";
import { app } from "../app";
import { verifyJWT } from "../middlewares/jwt.middleware";

// creating router
const router = Router();

// defining routes

// unprotected routes
router.post("/create", register);
router.post("/login", login);

// protected routes
// middleware for authorization
router.use(verifyJWT);
// middleware for authorization
router.get("/logout", logout);

// exporting router
export default router;
