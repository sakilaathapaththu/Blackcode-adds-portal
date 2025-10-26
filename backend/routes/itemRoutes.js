import express from "express";
import multer from "multer";
import Item from "../models/Item.js"; // note: 'models', not 'model'

const router = express.Router();
const upload = multer(); // memory storage (file in buffer)

// Create new Item
router.post("/", upload.single("posterImage"), async (req, res) => {
  try {
    const { title, description, category, price, deliveryTime, specializations } =
      req.body;

    let posterImage = {};
    if (req.file) {
      posterImage = {
        data: req.file.buffer.toString("base64"),
        mime: req.file.mimetype,
      };
    }

    const newItem = new Item({
      title,
      description,
      category,
      price,
      deliveryTime,
      specializations: specializations
        ? JSON.parse(specializations) // expect JSON string from frontend
        : [],
      posterImage,
    });

    await newItem.save();
    res.status(201).json(newItem);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error creating item" });
  }
});

//  Get all Items
router.get("/", async (req, res) => {
  try {
    const items = await Item.find().select("-posterImage"); // exclude image for list
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: "Error fetching items" });
  }
});

//  Get single Item (with image)
router.get("/:id", async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ error: "Item not found" });
    res.json(item);
  } catch (err) {
    res.status(500).json({ error: "Error fetching item" });
  }
});

//  Get poster image directly
router.get("/:id/poster", async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item || !item.posterImage || !item.posterImage.data) {
      return res.status(404).json({ error: "Poster not found" });
    }

    res.set("Content-Type", item.posterImage.mime);
    res.send(Buffer.from(item.posterImage.data, "base64"));
  } catch (err) {
    res.status(500).json({ error: "Error fetching poster" });
  }
});

export default router;
