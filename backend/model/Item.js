// models/Item.js
const mongoose = require("mongoose");

const ImageSchema = new mongoose.Schema(
  {
    data: { type: String, default: null }, // base64 string
    mime: {
      type: String,
      enum: ["image/jpeg", "image/png", "image/webp"],
      default: null,
    },
  },
  { _id: false }
);

const ItemSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    category: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    deliveryTime: { type: String, trim: true }, // "2 Days"
    specializations: [{ type: String, trim: true }], // ["Python", "ML", "DS"]
    posterImage: { type: ImageSchema, default: () => ({}) },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Item", ItemSchema);
