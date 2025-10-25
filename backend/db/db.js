// config/db.js
import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    const uri = process.env.MONGO_URI;              // e.g. mongodb://localhost:27017
    const dbName = process.env.MONGO_DBNAME || "addportal";

    const conn = await mongoose.connect(uri, {
      dbName,                                       // <- ensures the DB name is "addportal"
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`✅ MongoDB Connected: ${conn.connection.host}/${dbName}`);
  } catch (err) {
    console.error("❌ MongoDB connection error:", err.message);
    process.exit(1);
  }
};
