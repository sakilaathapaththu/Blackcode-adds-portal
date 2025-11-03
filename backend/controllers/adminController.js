import fs from "fs";
import path from "path";
import User from "../models/User.js";
import Post from "../models/Post.js";

/** Delete file if exists, ignore errors. */
function safeUnlink(absPath) {
  try {
    if (fs.existsSync(absPath)) fs.unlinkSync(absPath);
  } catch (err) {
    console.warn("safeUnlink error:", absPath, err?.message);
  }
}

/**
 * DELETE /api/admin/users/:id
 * - Only provider/admin can call
 * - Prevents self-delete
 * - Deletes user's posts (and their uploaded images), then deletes user
 */
export async function deleteUserAndContent(req, res) {
  try {
    const { id } = req.params;

    // 1) Disallow deleting yourself
    if (req.user?._id?.toString() === id) {
      return res.status(400).json({ message: "You cannot delete your own account." });
    }

    // 2) Ensure user exists
    const user = await User.findById(id).select("_id username name");
    if (!user) return res.status(404).json({ message: "User not found" });

    // 3) Find all posts by this user
    const posts = await Post.find({ owner: id }).select("_id image");
    let imagesRemoved = 0;

    // 4) Remove any uploaded images from disk
    for (const p of posts) {
      if (p.image) {
        // image stored like "/uploads/filename.jpg"
        const abs = path.join(process.cwd(), p.image.replace(/^\/+/, ""));
        safeUnlink(abs);
        imagesRemoved++;
      }
    }

    // 5) Delete all posts by this user
    const postsResult = await Post.deleteMany({ owner: id });

    // 6) Delete user
    await User.findByIdAndDelete(id);

    return res.json({
      message: "User and content deleted",
      userId: id,
      postsDeleted: postsResult.deletedCount || 0,
      imagesDeleted: imagesRemoved,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
}
