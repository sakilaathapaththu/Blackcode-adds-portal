// models/Post.js
import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    price: { type: Number, required: false },
    category: { type: String, required: false, trim: true },
    image: { type: String, required: false }, // store relative path like "/uploads/filename.jpg"
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    // optional extra fields
    location: { type: String },
    contact: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model("Post", postSchema);
