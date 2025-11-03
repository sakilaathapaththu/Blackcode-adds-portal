// // controllers/postController.js


import Post from "../models/Post.js";
import User from "../models/User.js";
import fs from "fs";
import path from "path";

// small helper
const toBool = (v) => {
  if (typeof v === "boolean") return v;
  if (v === "1" || v === 1 || v === "true") return true;
  if (v === "0" || v === 0 || v === "false") return false;
  return undefined;
};

const activeDateFilter = () => {
  const now = new Date();
  return {
    $and: [
      { $or: [{ startDate: { $exists: false } }, { startDate: { $lte: now } }] },
      { $or: [{ endDate: { $exists: false } }, { endDate: { $gte: now } }] },
    ],
  };
};

// Create post (multipart/form-data; image optional)
export const createPost = async (req, res) => {
  try {
    const {
      title,
      description,
      price,
      category,
      deliveryTime,
      specializations,
      contact,
      startDate,
      endDate,
      // NOTE: status & sponsored are admin-only; ignore here for normal users
    } = req.body;

    if (!title || !description || !price || !category)
      return res
        .status(400)
        .json({ message: "Title, description, price, and category are required" });

    const postData = {
      title,
      description,
      price: Number(price),
      category,
      deliveryTime: deliveryTime || "",
      specializations: specializations ? JSON.parse(specializations) : [],
      owner: req.user._id,
      contact,
      // NEW: allow user to schedule visibility window (optional)
      startDate: startDate ? new Date(startDate) : undefined,
      endDate: endDate ? new Date(endDate) : undefined,
      // status stays "pending" until admin approves
    };

    if (req.file) {
      postData.image = `/uploads/${req.file.filename}`;
    }

    const post = await Post.create(postData);
    await post.populate("owner", "username name");
    res.status(201).json({ message: "Post created (pending approval)", post });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Get all posts (public list: only approved + active window)
export const getPosts = async (req, res) => {
  try {
    const filter = { status: "approved", ...activeDateFilter() };

    // Optional: let admins view all via ?include=all
    const includeAll = req.query.include === "all";
    if (includeAll && req.user?.role === "provider") {
      delete filter.status;
      delete filter.$and; // show everything to admin if asked
    }

    const posts = await Post.find(filter)
      .sort({ sponsored: -1, sortCount: -1, createdAt: -1 })
      .populate("owner", "username name");

    res.json(posts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Get single post (public: only if approved & active; owner/provider can always see)
export const getPost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate(
      "owner",
      "username name"
    );
    if (!post) return res.status(404).json({ message: "Post not found" });

    const isOwner =
      req.user && post.owner && post.owner._id.toString() === req.user._id.toString();
    const isAdmin = req.user && req.user.role === "provider";

    if (!isOwner && !isAdmin) {
      // public view restriction
      const now = new Date();
      const startsOk = !post.startDate || post.startDate <= now;
      const endsOk = !post.endDate || post.endDate >= now;
      const active = startsOk && endsOk;

      if (post.status !== "approved" || !active)
        return res.status(404).json({ message: "Post not found" });
    }

    res.json(post);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Update post (owner can edit their fields; only admin can change status/sponsored)
export const updatePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    const isOwner = post.owner.toString() === req.user._id.toString();
    const isAdmin = req.user.role === "provider";
    if (!isOwner && !isAdmin) return res.status(403).json({ message: "Forbidden: not owner" });

    const {
      title,
      description,
      price,
      category,
      deliveryTime,
      specializations,
      contact,
      startDate,
      endDate,
      status,     // admin-only
      sponsored,  // admin-only
      sortCount,  // admin-only
    } = req.body;

    if (title) post.title = title;
    if (description) post.description = description;
    if (price !== undefined) post.price = Number(price);
    if (category) post.category = category;
    if (deliveryTime) post.deliveryTime = deliveryTime;
    if (specializations) post.specializations = JSON.parse(specializations);
    if (contact) post.contact = contact;
    if (startDate !== undefined) post.startDate = startDate ? new Date(startDate) : undefined;
    if (endDate !== undefined) post.endDate = endDate ? new Date(endDate) : undefined;

    // admin-only fields
    if (isAdmin) {
      if (status) post.status = status; // expects one of enum
      if (sponsored !== undefined) {
        const b = toBool(sponsored);
        if (b !== undefined) post.sponsored = b;
      }
      if (sortCount !== undefined) post.sortCount = Number(sortCount) || 0;
    }

    if (req.file) {
      // Delete old image (uploads/ at project root)
      if (post.image) {
        const oldPath = path.join(process.cwd(), post.image.replace(/^\/+/, ""));
        if (fs.existsSync(oldPath)) {
          try {
            fs.unlinkSync(oldPath);
          } catch (err) {
            console.warn("Failed to delete old image", err);
          }
        }
      }
      post.image = `/uploads/${req.file.filename}`;
    }

    await post.save();
    await post.populate("owner", "username name");
    res.json({ message: "Post updated", post });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Delete post (owner or provider) + image
export const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    if (post.owner.toString() !== req.user._id.toString() && req.user.role !== "provider")
      return res.status(403).json({ message: "Forbidden: not owner" });

    if (post.image) {
      const filePath = path.join(process.cwd(), post.image.replace(/^\/+/, ""));
      if (fs.existsSync(filePath)) {
        try {
          fs.unlinkSync(filePath);
          console.log("Deleted image:", filePath);
        } catch (err) {
          console.warn("Failed to delete image:", err);
        }
      }
    }

    await Post.findByIdAndDelete(req.params.id);
    res.json({ message: "Post deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Get posts of the logged-in user (owner can see all their posts in any status)
export const getUserPosts = async (req, res) => {
  try {
    const posts = await Post.find({ owner: req.user._id })
      .sort({ createdAt: -1 })
      .populate("owner", "username name");
    res.json(posts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// ---- NEW: Admin status/sponsor toggle ----
export const setPostStatus = async (req, res) => {
  try {
    const { status, sponsored, sortCount } = req.body; // status in ["pending","approved","canceled"]
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    if (status) post.status = status;
    if (sponsored !== undefined) {
      const b = toBool(sponsored);
      if (b !== undefined) post.sponsored = b;
    }
    if (sortCount !== undefined) post.sortCount = Number(sortCount) || 0;

    await post.save();
    await post.populate("owner", "username name");
    res.json({ message: "Status updated", post });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
