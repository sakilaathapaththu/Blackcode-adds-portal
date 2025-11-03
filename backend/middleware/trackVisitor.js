// middleware/trackVisitor.js
import crypto from "crypto";
import MetricsDaily from "../models/MetricsDaily.js";
import VisitorDaily from "../models/VisitorDaily.js";
import OnlinePresence from "../models/OnlinePresence.js";

export default function makeTrackVisitor({ redis }) {
  const dayKey = () => new Date().toISOString().slice(0, 10);

  // stable, non-PII hash of IP + User-Agent
  const hashVisitor = (req) => {
    const ip =
      (req.headers["x-forwarded-for"] || req.socket.remoteAddress || "")
        .split(",")[0]
        .trim();
    const ua = req.headers["user-agent"] || "";
    return crypto.createHash("sha1").update(`${ip}::${ua}`).digest("hex");
  };

  return async function trackVisitor(req, res, next) {
    try {
      const today = dayKey();
      const visitor = hashVisitor(req);

      // ---------- Redis fast path ----------
      if (redis) {
        // uniques (per day)
        await redis.sadd(`uv:${today}`, visitor);
        // pv (optional in redis – we still persist PV in Mongo below)
        await redis.incr(`pv:${today}`);
        // presence (5 min TTL)
        await redis.set(`on:${visitor}`, "1", { EX: 300 });
        await redis.sadd("online:now", visitor);
      }

      // ---------- Mongo persistence ----------
      // 1) Page views
      await MetricsDaily.updateOne(
        { date: today },
        { $inc: { pageViews: 1 } },
        { upsert: true }
      );

      // 2) Unique visitors (Mongo route, idempotent per day)
      //    Insert (date, hash). If it's a duplicate, it’s already counted.
      try {
        await VisitorDaily.create({ date: today, hash: visitor });
        await MetricsDaily.updateOne(
          { date: today },
          { $inc: { uniqueVisitors: 1 } },
          { upsert: true }
        );
      } catch {
        // duplicate → ignore
      }

      // 3) Online presence (Mongo fallback)
      if (!redis) {
        const now = new Date();
        await OnlinePresence.updateOne(
          { hash: visitor },
          {
            $set: {
              lastSeen: now,
              expiresAt: new Date(now.getTime() + 6 * 60 * 1000), // refresh TTL ~6 min
            },
          },
          { upsert: true }
        );
      }

      next();
    } catch (e) {
      // Never block the request due to metrics
      next();
    }
  };
}
