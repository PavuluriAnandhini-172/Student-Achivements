import express from "express";
import { protect } from "../middleware/auth.js";
import Student from "../models/Student.js";

const router = express.Router();

router.get("/me", protect, async (req, res) => {
  res.json(req.student);
});

router.put("/me", protect, async (req, res) => {
  const updates = { ...req.body };
  if (updates.password) {
    delete updates.password; // password updates should be handled separately if needed
  }

  const student = await Student.findByIdAndUpdate(req.student._id, updates, { new: true }).select("-password");
  res.json(student);
});

export default router;
