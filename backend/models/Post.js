// import mongoose from "mongoose";

// const postSchema = new mongoose.Schema(
//   {
//     title: { type: String, required: true, trim: true },
//     description: { type: String, required: true },
//     price: { type: Number, required: true, min: 0 },
//     category: { type: String, required: true, trim: true },
//     deliveryTime: { type: String, trim: true }, // e.g., "2 Days"
//     specializations: [{ type: String, trim: true }], // ["Python", "ML", "DS"]
    
//     image: { type: String, required: false }, // store relative path like "/uploads/filename.jpg"
//     owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
//     contact: { type: String },
//   },
//   { timestamps: true }
// );

// export default mongoose.model("Post", postSchema);
// models/Post.js
import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    category: { type: String, required: true, trim: true },
    deliveryTime: { type: String, trim: true }, // e.g., "2 Days"
    specializations: [{ type: String, trim: true }], // ["Python", "ML", "DS"]

    image: { type: String, required: false }, // relative path like "/uploads/filename.jpg"
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    contact: { type: String },

    // NEW FIELDS
    status: {
      type: String,
      enum: ["pending", "approved", "canceled"],
      default: "pending",
      index: true,
    },
    sortCount: { type: Number, default: 0 }, // optional helper for ranking/sorting
    startDate: { type: Date },               // optional visibility window
    endDate: { type: Date },                 // optional visibility window
    sponsored: { type: Boolean, default: false }, // 0/1 or true/false
  },
  { timestamps: true }
);

// (Optional) computed helper — not persisted
postSchema.virtual("isActive").get(function () {
  const now = new Date();
  const startsOk = !this.startDate || this.startDate <= now;
  const endsOk = !this.endDate || this.endDate >= now;
  return startsOk && endsOk;
});

export default mongoose.model("Post", postSchema);
