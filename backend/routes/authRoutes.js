// routes/authRoutes.js
import { Router } from "express";
import {
  register, login, me, googleLogin,
  forgotPassword, resetPasswordWithOTP
} from "../controllers/authController.js";
import { protect } from "../middleware/auth.js";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/google", googleLogin);
router.get("/me", protect, me);

// NEW:
router.post("/forgot", forgotPassword);           // send OTP
router.post("/reset", resetPasswordWithOTP);      // verify + set new password

export default router;
