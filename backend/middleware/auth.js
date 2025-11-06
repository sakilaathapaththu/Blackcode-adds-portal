
// middleware/auth.js
import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || "";
    const token = authHeader.startsWith("Bearer ") ? authHeader.split(" ")[1] : null;

    if (!token) return res.status(401).json({ message: "Not authorized, no token" });

    const SECRET = process.env.JWT_SECRET;
    if (!SECRET) {
      // Make misconfig obvious instead of a generic failure
      return res.status(500).json({ message: "Server misconfig: JWT_SECRET not set" });
    }

    const decoded = jwt.verify(token, SECRET); // may throw (expired, invalid signature, etc.)
    if (!decoded?.id) {
      return res.status(401).json({ message: "Not authorized, bad token payload" });
    }

    const user = await User.findById(decoded.id).select("-password");
    if (!user) return res.status(401).json({ message: "User not found" });

    req.user = user;
    next();
  } catch (err) {
    // Surface the real reason to the client for now (you can log-only later)
    return res.status(401).json({ message: "Not authorized, token failed", error: err?.message });
  }
};

export const adminOnly = (req, res, next) => {
  if (req.user?.role === "provider") return next();
  return res.status(403).json({ message: "Forbidden: admin only" });
};
