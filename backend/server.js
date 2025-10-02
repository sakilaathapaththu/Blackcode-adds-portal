const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const itemRoutes = require("./routes/itemRoutes");


const connectDB = require("./db/db");

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/items", itemRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT} 🚀`));
