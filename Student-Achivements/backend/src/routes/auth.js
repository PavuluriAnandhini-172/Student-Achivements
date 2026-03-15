import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Student from "../models/Student.js";

const router = express.Router();

router.post("/register", async (req, res) => {
  const { name, regNumber, email, phone, admissionCategory, academicProgram, password } = req.body;

  if (!name || !regNumber || !email || !phone || !admissionCategory || !academicProgram || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const existing = await Student.findOne({ $or: [{ regNumber }, { email }] });
  if (existing) {
    return res.status(409).json({ message: "Student with this email or registration number already exists" });
  }

  const hashed = await bcrypt.hash(password, 10);
  const student = await Student.create({
    name,
    regNumber,
    email,
    phone,
    admissionCategory,
    academicProgram,
    password: hashed,
  });

  const token = jwt.sign({ id: student._id }, process.env.JWT_SECRET || "", { expiresIn: "7d" });

  res.status(201).json({
    student: {
      id: student._id,
      name: student.name,
      regNumber: student.regNumber,
      email: student.email,
      phone: student.phone,
      admissionCategory: student.admissionCategory,
      academicProgram: student.academicProgram,
      avatar: student.avatar,
    },
    token,
  });
});

router.post("/login", async (req, res) => {
  const { regNumber, password } = req.body;
  if (!regNumber || !password) {
    return res.status(400).json({ message: "Registration number and password are required" });
  }

  const student = await Student.findOne({ regNumber });
  if (!student) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const isMatch = await bcrypt.compare(password, student.password);
  if (!isMatch) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const token = jwt.sign({ id: student._id }, process.env.JWT_SECRET || "", { expiresIn: "7d" });
  res.json({
    student: {
      id: student._id,
      name: student.name,
      regNumber: student.regNumber,
      email: student.email,
      phone: student.phone,
      admissionCategory: student.admissionCategory,
      academicProgram: student.academicProgram,
      avatar: student.avatar,
    },
    token,
  });
});

router.post("/admin/login", async (req, res) => {
  const { username, password } = req.body;
  if (username === "admin" && password === "admin123") {
    const token = jwt.sign({ type: "admin" }, process.env.JWT_SECRET || "", { expiresIn: "7d" });
    res.json({ token });
  } else {
    res.status(401).json({ message: "Invalid admin credentials" });
  }
});

export default router;

