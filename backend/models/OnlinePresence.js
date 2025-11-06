// models/OnlinePresence.js
import mongoose from "mongoose";

const OnlinePresenceSchema = new mongoose.Schema({
  hash: { type: String, unique: true, index: true }, // visitor fingerprint
  lastSeen: { type: Date, default: Date.now, index: true },
  // TTL index to auto-remove after ~6 minutes of inactivity
  // Note: TTL index is created on a Date field + expires: <seconds>
  expiresAt: { type: Date, default: () => new Date(Date.now() + 6 * 60 * 1000), expires: 6 * 60 }
});

export default mongoose.model("OnlinePresence", OnlinePresenceSchema);
