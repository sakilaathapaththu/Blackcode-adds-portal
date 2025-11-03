// routes/metricsRoutes.js
import express from "express";

export default function makeMetricsRouter({ User, MetricsDaily, redis, OnlinePresence }) {
  const router = express.Router();
  const dayKey = () => new Date().toISOString().slice(0, 10);

  // GET /api/metrics/summary
  router.get("/summary", async (req, res) => {
    try {
      const today = dayKey();

      const [registeredUsers, daily] = await Promise.all([
        User.countDocuments(),
        MetricsDaily.findOne({ date: today }).lean(),
      ]);

      let onlineNow = 0;
      let uniqueToday = daily?.uniqueVisitors || 0;
      let pageViewsToday = daily?.pageViews || 0;

      if (redis) {
        const [onlineCount, uniqueCount, pv] = await Promise.all([
          redis.scard("online:now"),
          redis.scard(`uv:${today}`),
          redis.get(`pv:${today}`),
        ]);
        onlineNow = onlineCount || 0;
        uniqueToday = uniqueCount || uniqueToday;
        pageViewsToday = pv ? parseInt(pv, 10) : pageViewsToday;
      } else {
        // Mongo fallback for "online now": seen within last 5 minutes
        const fiveMinAgo = new Date(Date.now() - 5 * 60 * 1000);
        onlineNow = await OnlinePresence.countDocuments({ lastSeen: { $gte: fiveMinAgo } });
      }

      res.json({
        registeredUsers,
        onlineNow,
        uniqueToday,
        pageViewsToday,
      });
    } catch (e) {
      res.status(500).json({ message: e.message || "Failed to load metrics" });
    }
  });

  return router;
}
