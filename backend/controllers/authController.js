// controllers/authController.js
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { OAuth2Client } from "google-auth-library";


const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const signToken = (user) =>
  jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES || "7d",
  });

// POST /api/auth/register
export const register = async (req, res) => {
  try {
    const { name, username, email, phone, password, role } = req.body;

    if (!name || !username || !email || !phone || !password) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Normalize
    const normalized = {
      name: String(name).trim(),
      username: String(username).toLowerCase().trim(),
      email: String(email).toLowerCase().trim(),
      phone: String(phone).trim(),
      password: String(password),
      role: role || "user",
    };

    // Uniqueness checks (optional optimization; unique indexes also enforce)
    const exists = await User.findOne({
      $or: [{ email: normalized.email }, { username: normalized.username }, { phone: normalized.phone }],
    });
    if (exists) {
      return res.status(409).json({ message: "User with same email/username/phone already exists" });
    }

    const user = await User.create(normalized);
    const token = signToken(user);

    res.status(201).json({
      message: "User registered",
      token,
      user: {
        id: user._id,
        name: user.name,
        username: user.username,
        email: user.email,
        phone: user.phone,
        role: user.role,
        createdAt: user.createdAt,
      },
    });
  } catch (err) {
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

// POST /api/auth/login
// Accepts either { usernameOrPhone, password }  OR  { username, password } OR { phone, password }
export const login = async (req, res) => {
  try {
    const { username, phone, usernameOrPhone, password } = req.body;
    const identifier = (usernameOrPhone ?? username ?? phone ?? "").toString().trim();

    if (!identifier || !password) {
      return res.status(400).json({ message: "identifier and password required" });
    }

    // Decide which field: if all digits -> phone, else -> username (lowercased)
    const isPhone = /^\+?\d+$/.test(identifier);
    const query = isPhone
      ? { phone: identifier }
      : { username: identifier.toLowerCase() };

    const user = await User.findOne(query);
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    const ok = await user.matchPassword(password);
    if (!ok) return res.status(401).json({ message: "Invalid credentials" });

    const token = signToken(user);
    res.json({
      message: "Logged in",
      token,
      user: {
        id: user._id,
        name: user.name,
        username: user.username,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
    });
  } catch (err) {
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

// GET /api/auth/me
export const me = async (req, res) => {
  res.json({ user: req.user });
};

// POST /api/auth/google
export const googleLogin = async (req, res) => {
  try {
    const { idToken } = req.body; // credential from Google Identity Services
    if (!idToken) return res.status(400).json({ message: "Missing idToken" });

    // Verify Google token
    const ticket = await googleClient.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    // payload contains: email, name, picture, sub (google user id), etc.
    const { email, name, sub } = payload || {};

    if (!email) {
      return res.status(400).json({ message: "Google token missing email" });
    }

    // Try to find user by email
    let user = await User.findOne({ email: email.toLowerCase() });

    // If not exists, create with required fields satisfied
    if (!user) {
      // username must be unique and lowercase
      const baseUsername = (email.split("@")[0] || `user${sub}`).toLowerCase();
      let username = baseUsername;
      // ensure username uniqueness
      let tries = 0;
      // eslint-disable-next-line no-constant-condition
      while (await User.exists({ username })) {
        tries += 1;
        username = `${baseUsername}${tries}`;
      }

      // phone is required & unique in your schema; generate a placeholder unique value
      // (no formatting constraints are enforced server-side)
      const phone = `g-${sub}`;

      // password is required; store a random one (user won’t use password for Google logins)
      const randomPassword = `${sub}-${Math.random().toString(36).slice(2, 10)}`;

      user = await User.create({
        name: name || baseUsername,
        username,
        email: email.toLowerCase(),
        phone,
        password: randomPassword,
        role: "user", // default to user; you can elevate later in DB if needed
      });
    }

    const token = signToken(user);

    return res.json({
      message: "Google login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        username: user.username,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
    });
  } catch (err) {
    return res.status(401).json({ message: "Google auth failed", error: err.message });
  }
};