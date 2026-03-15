import express from "express";
import { protect } from "../middleware/auth.js";
import Achievement from "../models/Achievement.js";

const router = express.Router();

router.get("/", protect, async (req, res) => {
  const achievements = await Achievement.find({ studentId: req.student._id }).sort({ createdAt: -1 });
  res.json(achievements);
});

router.post("/", protect, async (req, res) => {
  const { title, activityType, academicYear, semester, description, certificateFileName, certificateData } = req.body;

  if (!title || !activityType || !academicYear || !semester || !description) {
    return res.status(400).json({ message: "All required fields must be filled out" });
  }

  const achievement = await Achievement.create({
    studentId: req.student._id,
    title,
    activityType,
    academicYear,
    semester,
    description,
    certificateFileName,
    certificateData,
  });

  res.status(201).json(achievement);
});

export default router;
