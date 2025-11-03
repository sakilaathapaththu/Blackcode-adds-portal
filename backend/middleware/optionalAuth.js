import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const optionalAuth = async (req, _res, next) => {
  try {
    const authHeader = req.headers.authorization || "";
    const token = authHeader.startsWith("Bearer ") ? authHeader.split(" ")[1] : null;
    if (!token) return next();

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded?.id) return next();

    const user = await User.findById(decoded.id).select("-password");
    if (user) req.user = user; // attach user if valid
  } catch {
    // ignore bad/expired token; proceed as unauthenticated
  }
  next();
};
