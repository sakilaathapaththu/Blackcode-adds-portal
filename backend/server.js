// // server.js
// import express from "express";
// import dotenv from "dotenv";
// import cors from "cors";
// import path from "path";
// import { connectDB } from "./db/db.js";
// import authRoutes from "./routes/authRoutes.js";
// import postRoutes from "./routes/postRoutes.js";
// import adminRoutes from "./routes/adminRoutes.js"; // if you added it

// dotenv.config();
// const app = express();

// // --- CORS ---
// const ALLOWED_ORIGINS = [
//   process.env.FRONTEND_ORIGIN,               // optional: single origin via env
//   "http://localhost:3000",
//   "http://127.0.0.1:3000",
//   "http://localhost:5173",
//   "http://127.0.0.1:5173",
//   "http://72.60.42.120:3201",
// ].filter(Boolean);

// app.use(
//   cors({
//     origin(origin, cb) {
//       // Allow requests with no origin like curl or same-origin
//       if (!origin) return cb(null, true);
//       if (ALLOWED_ORIGINS.includes(origin)) return cb(null, true);
//       return cb(new Error(`CORS: ${origin} not allowed`));
//     },
//     methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
//     allowedHeaders: ["Content-Type", "Authorization"],
//     credentials: false, // set true only if you actually use cookies
//     optionsSuccessStatus: 200,
//   })
// );

// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// // Static
// app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

// // Routes
// app.use("/api/auth", authRoutes);
// app.use("/api/posts", postRoutes);
// app.use("/api/admin", adminRoutes); // if present

// // Health
// app.get("/", (_req, res) => res.send("Auth API OK"));

// // Start
// await connectDB();
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

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

// NEW:
import MetricsDaily from "./models/MetricsDaily.js";
import OnlinePresence from "./models/OnlinePresence.js";
import makeTrackVisitor from "./middleware/trackVisitor.js";
import makeMetricsRouter from "./routes/metricsRoutes.js";
import User from "./models/User.js"; // <-- your existing user model path

dotenv.config();
const app = express();

// Resolve __dirname for ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// --- CORS ---
const ALLOWED_ORIGINS = [
  process.env.FRONTEND_ORIGIN,
  "http://localhost:3000",
  "http://127.0.0.1:3000",
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "http://72.60.42.120:3201",
  "http://localhost:3201",
].filter(Boolean);

app.use(
  cors({
    origin(origin, cb) {
      if (!origin) return cb(null, true);
      if (ALLOWED_ORIGINS.includes(origin)) return cb(null, true);
      return cb(new Error(`CORS: ${origin} not allowed`));
    },
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: false,
    optionsSuccessStatus: 200,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// important if behind a proxy / load balancer (to get correct client IP)
app.set("trust proxy", true);

// Static
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

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

// ---------- Visitor tracking ----------
// You can scope this to certain GET routes if you don’t want to track all requests.
// Example: app.get(["/","/items","/posts/:id"], makeTrackVisitor({ redis }));
app.use(makeTrackVisitor({ redis }));

// ---------- API Routes ----------
app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);
if (adminRoutes) app.use("/api/admin", adminRoutes);

// Metrics routes (use Mongo fallback for "online" if no redis)
import metricsRouterFactory from "./routes/metricsRoutes.js";
app.use(
  "/api/metrics",
  metricsRouterFactory({ User, MetricsDaily, redis, OnlinePresence })
);

// Health
app.get("/", (_req, res) => res.send("Auth API OK"));

// Start
await connectDB();
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
