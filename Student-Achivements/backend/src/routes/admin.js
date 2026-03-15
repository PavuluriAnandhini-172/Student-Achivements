import express from "express";
import { adminProtect } from "../middleware/auth.js";
import Document from "../models/Document.js";
import Achievement from "../models/Achievement.js";
import Student from "../models/Student.js";

const router = express.Router();

router.get("/documents", adminProtect, async (req, res) => {
  const docs = await Document.find().populate("studentId", "name regNumber").sort({ uploadedAt: -1 });
  res.json(docs);
});

router.get("/achievements", adminProtect, async (req, res) => {
  const achievements = await Achievement.find().populate("studentId", "name regNumber").sort({ createdAt: -1 });
  res.json(achievements);
});

router.get("/students", adminProtect, async (req, res) => {
  const students = await Student.find().select("-password");
  res.json(students);
});

export default router;