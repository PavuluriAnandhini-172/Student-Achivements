import jwt from "jsonwebtoken";
import Student from "../models/Student.js";

export const adminProtect = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "");
    if (decoded.type !== "admin") {
      return res.status(403).json({ message: "Admin access required" });
    }
    req.admin = true;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized" });
  }
};
