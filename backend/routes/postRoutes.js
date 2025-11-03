// // routes/postRoutes.js
// import { Router } from "express";
// import { protect } from "../middleware/auth.js";
// import { upload } from "../middleware/upload.js";
// import {
//   createPost,
//   getPosts,
//   getPost,
//   updatePost,
//   deletePost,
// } from "../controllers/postController.js";
// import { getUserPosts } from "../controllers/postController.js";

// const router = Router();

// // Public routes (anyone can read)
// router.get("/", getPosts);
// router.get("/:id", getPost);

// // Protected routes (only logged-in users)
// router.post("/", protect, upload.single("image"), createPost);
// router.put("/:id", protect, upload.single("image"), updatePost);
// router.delete("/:id", protect, deletePost);
// router.get("/user/me", protect, getUserPosts);

// export default router;
import { Router } from "express";
import { protect, adminOnly } from "../middleware/auth.js";
import { optionalAuth } from "../middleware/optionalAuth.js";  // 👈
import { upload } from "../middleware/upload.js";
import {
  createPost,
  getPosts,
  getPost,
  updatePost,
  deletePost,
  getUserPosts,
  setPostStatus,
} from "../controllers/postController.js";

const router = Router();

// Public routes (keep public, but attach req.user if token present)
router.get("/", optionalAuth, getPosts);     // 👈 now sees req.user when called with token
router.get("/:id", optionalAuth, getPost);   // 👈 same here

// Protected routes
router.post("/", protect, upload.single("image"), createPost);
router.put("/:id", protect, upload.single("image"), updatePost);
router.delete("/:id", protect, deletePost);
router.get("/user/me", protect, getUserPosts);

// Admin action
router.patch("/:id/status", protect, adminOnly, setPostStatus);

export default router;
