// controllers/postController.js
import Post from "../models/Post.js";
import User from "../models/User.js";
import fs from "fs";
import path from "path";

// Create post (multipart/form-data; image optional)
export const createPost = async (req, res) => {
  try {
    const { title, description, price, category, deliveryTime, specializations, contact } = req.body;

    if (!title || !description || !price || !category)
      return res.status(400).json({ message: "Title, description, price, and category are required" });

    const postData = {
      title,
      description,
      price: Number(price),
      category,
      deliveryTime: deliveryTime || "",
      specializations: specializations ? JSON.parse(specializations) : [],
      owner: req.user._id,
      contact,
    };

    if (req.file) {
      postData.image = `/uploads/${req.file.filename}`;
    }

    const post = await Post.create(postData);
    await post.populate("owner", "username name");
    res.status(201).json({ message: "Post created", post });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Get all posts (with owner info)
export const getPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .populate("owner", "username name");
    res.json(posts); // return array directly
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Get single post
export const getPost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate("owner", "username name");
    if (!post) return res.status(404).json({ message: "Post not found" });
    res.json(post);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Update post (owner or provider)
export const updatePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    if (post.owner.toString() !== req.user._id.toString() && req.user.role !== "provider")
      return res.status(403).json({ message: "Forbidden: not owner" });

    const { title, description, price, category, deliveryTime, specializations, contact } = req.body;

    if (title) post.title = title;
    if (description) post.description = description;
    if (price !== undefined) post.price = Number(price);
    if (category) post.category = category;
    if (deliveryTime) post.deliveryTime = deliveryTime;
    if (specializations) post.specializations = JSON.parse(specializations);
    if (contact) post.contact = contact;

    if (req.file) {
      // Delete old image
      if (post.image) {
        const oldPath = path.join(process.cwd(), "backend", post.image.replace(/^\/+/, ""));
        if (fs.existsSync(oldPath)) {
          try { fs.unlinkSync(oldPath); } catch (err) { console.warn("Failed to delete old image", err); }
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

    // Delete image if exists
    if (post.image) {
      const filePath = path.join(process.cwd(), "backend", post.image.replace(/^\/+/, ""));
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
// Get posts of the logged-in user
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