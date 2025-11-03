// routes/authRoutes.js
import { Router } from "express";
import { register, login, me, googleLogin } from "../controllers/authController.js";
import { protect } from "../middleware/auth.js";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/google", googleLogin); // ← NEW
router.get("/me", protect, me);

export default router;
