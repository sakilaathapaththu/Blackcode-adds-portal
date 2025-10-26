import Item from "../models/Item.js";

// ✅ Create Item
export const createItem = async (req, res) => {
  try {
    const { title, description, category, price, deliveryTime, specializations } = req.body;

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
      specializations: specializations ? JSON.parse(specializations) : [],
      posterImage,
    });

    await newItem.save();
    res.status(201).json(newItem);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error creating item" });
  }
};

// ✅ Get all Items (excluding poster)
export const getAllItems = async (req, res) => {
  try {
    const items = await Item.find().select("-posterImage");
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: "Error fetching items" });
  }
};

// ✅ Get single Item
export const getItemById = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ error: "Item not found" });
    res.json(item);
  } catch (err) {
    res.status(500).json({ error: "Error fetching item" });
  }
};

// ✅ Get poster image
export const getPosterImage = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item || !item.posterImage?.data) {
      return res.status(404).json({ error: "Poster not found" });
    }

    res.set("Content-Type", item.posterImage.mime);
    res.send(Buffer.from(item.posterImage.data, "base64"));
  } catch (err) {
    res.status(500).json({ error: "Error fetching poster" });
  }
};
