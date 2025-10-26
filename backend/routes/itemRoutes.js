import express from "express";
import multer from "multer";
import {
  createItem,
  getAllItems,
  getItemById,
  getPosterImage,
} from "../controllers/itemController.js";

const router = express.Router();
const upload = multer(); // store file in memory (buffer)

// Routes
router.post("/", upload.single("posterImage"), createItem);
router.get("/", getAllItems);
router.get("/:id", getItemById);
router.get("/:id/poster", getPosterImage);

export default router;
