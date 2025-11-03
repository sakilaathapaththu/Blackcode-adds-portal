import { Router } from "express";
import { protect, adminOnly } from "../middleware/auth.js";
import User from "../models/User.js";
import { deleteUserAndContent } from "../controllers/adminController.js";

const router = Router();

router.get("/users", protect, adminOnly, async (_req, res) => {
  const users = await User.find().select("name username email phone role createdAt");
  res.json({ users });
});

router.patch("/users/:id/role", protect, adminOnly, async (req, res) => {
  const { role } = req.body;
  if (!["user", "provider"].includes(role)) {
    return res.status(400).json({ message: "Invalid role" });
  }
  const user = await User.findByIdAndUpdate(
    req.params.id,
    { role },
    { new: true }
  ).select("-password");
  if (!user) return res.status(404).json({ message: "User not found" });
  res.json({ message: "Role updated", user });
});

// ✅ NEW: delete user + cascade delete posts & images
router.delete("/users/:id", protect, adminOnly, deleteUserAndContent);

export default router;
