import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    category: { type: String, required: true, trim: true },
    deliveryTime: { type: String, trim: true }, // e.g., "2 Days"
    specializations: [{ type: String, trim: true }], // ["Python", "ML", "DS"]
    
    image: { type: String, required: false }, // store relative path like "/uploads/filename.jpg"
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    contact: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model("Post", postSchema);
