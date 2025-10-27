// controllers/postController.js
import Post from "../models/Post.js";
import User from "../models/User.js";
import fs from "fs";
import path from "path";

// Create post (multipart/form-data; image optional)
export const createPost = async (req, res) => {
  try {
    const { title, description, price, category, location, contact } = req.body;
    if (!title || !description) return res.status(400).json({ message: "title and description required" });

    const postData = {
      title,
      description,
      price: price ? Number(price) : undefined,
      category,
      owner: req.user._id,
      location,
      contact,
    };

    if (req.file) {
      postData.image = `/uploads/${req.file.filename}`;
    }

    const post = await Post.create(postData);
    await post.populate("owner", "username name"); // include owner info
    res.status(201).json({ message: "Post created", post });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Get all posts (with owner info)
export const getPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .populate("owner", "username name");
    res.json({ posts });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Get single post
export const getPost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate("owner", "username name");
    if (!post) return res.status(404).json({ message: "Post not found" });
    res.json({ post });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Update post (owner or provider)
export const updatePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    // Only owner or provider can update
    if (post.owner.toString() !== req.user._id.toString() && req.user.role !== "provider")
      return res.status(403).json({ message: "Forbidden: not owner" });

    const { title, description, price, category, location, contact } = req.body;
    if (title) post.title = title;
    if (description) post.description = description;
    if (price !== undefined) post.price = Number(price);
    if (category) post.category = category;
    if (location) post.location = location;
    if (contact) post.contact = contact;

    // replace image if provided (delete old file)
    if (req.file) {
      if (post.image) {
        const oldPath = path.join(process.cwd(), post.image);
        if (fs.existsSync(oldPath)) {
          try { fs.unlinkSync(oldPath); } catch (e) {}
        }
      }
      post.image = `/uploads/${req.file.filename}`;
    }

    await post.save();
    await post.populate("owner", "username name");
    res.json({ message: "Post updated", post });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Delete post (owner or provider)
export const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    if (post.owner.toString() !== req.user._id.toString() && req.user.role !== "provider")
      return res.status(403).json({ message: "Forbidden: not owner" });

    // remove image file if exists
    if (post.image) {
      const f = path.join(process.cwd(), post.image);
      if (fs.existsSync(f)) {
        try { fs.unlinkSync(f); } catch (e) {}
      }
    }

    await post.remove();
    res.json({ message: "Post deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
