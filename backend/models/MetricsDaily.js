// models/MetricsDaily.js
import mongoose from "mongoose";

const MetricsDailySchema = new mongoose.Schema(
  {
    date: { type: String, required: true, unique: true }, // 'YYYY-MM-DD'
    pageViews: { type: Number, default: 0 },
    uniqueVisitors: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model("MetricsDaily", MetricsDailySchema);
