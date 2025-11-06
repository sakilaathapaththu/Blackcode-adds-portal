// models/VisitorDaily.js
import mongoose from "mongoose";

const VisitorDailySchema = new mongoose.Schema({
  date: { type: String, index: true },   // YYYY-MM-DD
  hash: { type: String, index: true },   // visitor fingerprint (sha1 of ip+ua)
  createdAt: { type: Date, default: Date.now, expires: 60 * 60 * 24 * 2 }, // cleanup in 2 days
});

VisitorDailySchema.index({ date: 1, hash: 1 }, { unique: true });

export default mongoose.model("VisitorDaily", VisitorDailySchema);
