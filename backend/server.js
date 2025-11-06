


// server.js
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import { connectDB } from "./db/db.js";

import authRoutes from "./routes/authRoutes.js";
import postRoutes from "./routes/postRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";

// NEW (existing in your project):
import MetricsDaily from "./models/MetricsDaily.js";
import OnlinePresence from "./models/OnlinePresence.js";
import makeTrackVisitor from "./middleware/trackVisitor.js";
import metricsRouterFactory from "./routes/metricsRoutes.js";
import User from "./models/User.js";

dotenv.config();
const app = express();

// Resolve __dirname for ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// --- CORS (safe for local dev; prod is same-origin) ---
const RAW_ALLOWED = [
  process.env.FRONTEND_ORIGIN,
  // Production origins
  "https://spotmyad.blackcodedev.com",
  "https://api.spotmyad.blackcodedev.com",
  // Local dev origins
  "http://localhost:3000",
  "http://127.0.0.1:3000",
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "http://localhost:3201",
  "http://127.0.0.1:3201",
  "http://72.60.42.120:3201",
  "http://192.168.1.1:3201",
].filter(Boolean);

const ALLOWED_ORIGINS = RAW_ALLOWED.map((o) => o.replace(/\/+$/, ""));

app.use(
  cors({
    origin(origin, cb) {
      if (!origin) return cb(null, true); // curl / server-to-server / same-origin
      const norm = origin.replace(/\/+$/, "");
      if (ALLOWED_ORIGINS.includes(norm)) return cb(null, true);
      return cb(new Error(`CORS: ${origin} not allowed`));
    },
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: false,
    optionsSuccessStatus: 200,
  })
);

// Body parsers
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));

// Behind proxy
app.set("trust proxy", true);

// --- Static uploads (⚠️ key fix) ---
const uploadsDir = path.join(process.cwd(), "uploads");

// Direct backend path (useful when hitting Node directly)
app.use("/uploads", express.static(uploadsDir));

// ✅ Also expose via /api so Apache’s “/api → 127.0.0.1:5501” proxy can serve files
app.use("/api/uploads", express.static(uploadsDir));

// ---------- Optional Redis ----------
let redis = null;
if (process.env.REDIS_URL) {
  try {
    const { createClient } = await import("redis");
    redis = createClient({ url: process.env.REDIS_URL });
    redis.on("error", (err) => console.error("Redis error:", err));
    await redis.connect();
    console.log("✅ Redis connected");
  } catch (e) {
    console.warn("⚠️ Redis not connected:", e?.message || e);
    redis = null;
  }
}

// ---------- Visitor tracking (GET only) ----------
const trackMw = makeTrackVisitor({ redis });
app.use((req, res, next) => (req.method === "GET" ? trackMw(req, res, next) : next()));

// ---------- API Routes ----------
app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);
if (adminRoutes) app.use("/api/admin", adminRoutes);

// Metrics routes
app.use("/api/metrics", metricsRouterFactory({ User, MetricsDaily, redis, OnlinePresence }));

// Health
app.get("/api/health", (_req, res) => res.json({ ok: true }));

// Start
await connectDB();
const HOST = process.env.HOST || "127.0.0.1";
const PORT = Number(process.env.PORT || 5501);
app.listen(PORT, HOST, () =>
  console.log(`🚀 API listening on http://${HOST}:${PORT} (behind Apache /api)`)
);

