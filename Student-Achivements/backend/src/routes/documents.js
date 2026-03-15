import express from "express";
import { protect } from "../middleware/auth.js";
import Document from "../models/Document.js";

const router = express.Router();

// Get documents for the current student
router.get("/", protect, async (req, res) => {
  const docs = await Document.find({ studentId: req.student._id }).sort({ uploadedAt: -1 });
  res.json(docs);
});

// Upload a new document
router.post("/", protect, async (req, res) => {
  const { docType, fileName, fileData } = req.body;

  if (!docType || !fileName) {
    return res.status(400).json({ message: "Document type and file name are required" });
  }

  const document = await Document.create({
    studentId: req.student._id,
    docType,
    fileName,
    fileData,
  });

  res.status(201).json(document);
});

export default router;
